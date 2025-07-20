<?php

namespace App\Controllers;

use App\Models\Announcement;
use App\Helpers\ResponseHandler;

class AnnouncementController
{
    private $announcement;

    public function __construct($db)
    {
        $this->announcement = new Announcement($db);
    }

    public function getAll()
    {
        $query = $_GET;

        $page     = isset($query['page']) ? (int)$query['page'] : 1;
        $limit    = isset($query['limit']) ? (int)$query['limit'] : 10;
        $search   = $query['search'] ?? '';
        $category = $query['category'] ?? null;
        $author   = $query['author'] ?? null;
        $sort     = $query['sort'] ?? 'start_date_desc';
        $start    = $query['start'] ?? null;
        $end      = $query['end'] ?? null;

        $data = $this->announcement->getFilteredAnnouncements($page, $limit, $search, $category, $author, $sort, $start, $end);
        return ResponseHandler::sendResponse($data);
    }

    public function getBySlug($slug)
    {
        $announcement = $this->announcement->getBySlug($slug);

        if ($announcement) {
            return ResponseHandler::sendResponse($announcement);
        }

        return ResponseHandler::sendError('Pengumuman tidak ditemukan.', 404);
    }

    public function create()
    {
        try {
            $data = $_POST;

            if (
                empty($data['title']) ||
                empty($data['content']) ||
                empty($data['start_date']) ||
                empty($data['end_date']) ||
                empty($data['category_id'])
            ) {
                return ResponseHandler::sendError('Semua data wajib diisi.', 400);
            }

            $author_id   = $_SERVER['auth']['user_id'];
            $title       = trim($data['title']);
            $slug        = $this->generateSlug($title);
            $category_id = $data['category_id'];

            // Cek apakah ada file yang valid diunggah
            $imagePath = null;
            if (!empty($_FILES['featured_image']['tmp_name']) && is_uploaded_file($_FILES['featured_image']['tmp_name'])) {
                $imagePath = $this->handleImageUpload($_FILES['featured_image']);
                if (!$imagePath) {
                    return ResponseHandler::sendError('Gagal mengunggah gambar.', 500);
                }
            }

            $announcementData = [
                'title'          => $title,
                'slug'           => $slug,
                'content'        => $data['content'],
                'author_id'      => $author_id,
                'is_important'   => $data['is_important'] ?? false,
                'start_date'     => $data['start_date'],
                'end_date'       => $data['end_date'],
                'category_id'    => $category_id,
                'featured_image' => $imagePath,
            ];

            $success = $this->announcement->insert($announcementData);

            if ($success) {
                return ResponseHandler::sendResponse(null, 'Pengumuman berhasil ditambahkan', 201);
            }

            return ResponseHandler::sendError('Gagal menambahkan pengumuman.', 500);
        } catch (\PDOException $e) {
            return ResponseHandler::sendError('Kesalahan database: ' . $e->getMessage(), 500);
        } catch (\Throwable $e) {
            return ResponseHandler::sendError('Kesalahan server: ' . $e->getMessage(), 500);
        }
    }
    public function partialUpdate($id)
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            ResponseHandler::sendError("Data tidak valid", 400);
            return;
        }

        try {
            $this->announcement->partialUpdate($id, $data);
            ResponseHandler::sendResponse(null, "Data berhasil diperbarui sebagian");
        } catch (\Exception $e) {
            ResponseHandler::sendError($e->getMessage(), 500);
        }
    }
    public function update($id)
    {
        try {
            $data = $_POST;

            if (
                empty($data['title']) ||
                empty($data['content']) ||
                empty($data['start_date']) ||
                empty($data['end_date']) ||
                empty($data['category_id'])
            ) {
                return ResponseHandler::sendError('Semua data wajib diisi.', 400);
            }

            $title       = trim($data['title']);
            $slug        = $this->generateSlug($title);
            $category_id = $data['category_id'];

            $imagePath = $data['old_image'] ?? null;
            if (!empty($_FILES['featured_image']['tmp_name']) && is_uploaded_file($_FILES['featured_image']['tmp_name'])) {
                $imagePath = $this->handleImageUpload($_FILES['featured_image']);
                if (!$imagePath) {
                    return ResponseHandler::sendError('Gagal mengunggah gambar.', 500);
                }
            }

            $announcementData = [
                'title'          => $title,
                'slug'           => $slug,
                'content'        => $data['content'],
                'is_important'   => $data['is_important'] ?? false,
                'start_date'     => $data['start_date'],
                'end_date'       => $data['end_date'],
                'category_id'    => $category_id,
                'featured_image' => $imagePath,
            ];

            $success = $this->announcement->update($id, $announcementData);

            if ($success) {
                return ResponseHandler::sendResponse(null, 'Pengumuman berhasil diperbarui');
            }

            return ResponseHandler::sendError('Gagal memperbarui pengumuman.', 500);
        } catch (\PDOException $e) {
            return ResponseHandler::sendError('Kesalahan database: ' . $e->getMessage(), 500);
        } catch (\Throwable $e) {
            return ResponseHandler::sendError('Kesalahan server: ' . $e->getMessage(), 500);
        }
    }


    public function delete($id)
    {
        $success = $this->announcement->delete($id);

        if ($success) {
            return ResponseHandler::sendResponse(null, 'Pengumuman berhasil dihapus');
        }

        return ResponseHandler::sendError('Gagal menghapus pengumuman', 500);
    }

    private function generateSlug($title)
    {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        return $slug . '-' . substr(md5(uniqid()), 0, 6);
    }

    private function handleImageUpload($file)
    {
        $uploadDir = __DIR__ . '/../../public/uploads/';
        $filename  = time() . '_' . basename($file['name']);
        $target    = $uploadDir . $filename;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        if (move_uploaded_file($file['tmp_name'], $target)) {
            return 'uploads/' . $filename; // relative path
        }

        return null;
    }
}
