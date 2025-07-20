<?php

namespace App\Controllers;

use App\Models\News;
use App\Helpers\ResponseHandler;

class NewsController
{
    private $news;

    public function __construct($db)
    {
        $this->news = new News($db);
    }

    public function getAll()
    {
        $query = $_GET;

        $page = isset($query['page']) ? (int)$query['page'] : 1;
        $limit = isset($query['limit']) ? (int)$query['limit'] : 10;
        $search = $query['search'] ?? '';
        $categorySlug = $query['category'] ?? null;
        $author = $query['author'] ?? null;
        $sort = $query['sort'] ?? 'published_at_desc';

        $data = $this->news->getFilteredNews($page, $limit, $search, $categorySlug, $author, $sort);
        return ResponseHandler::sendResponse($data);
    }

    public function getById($id)
    {
        $newsItem = $this->news->getByIdWithCategory($id);

        if ($newsItem) {
            return ResponseHandler::sendResponse($newsItem);
        }

        return ResponseHandler::sendError('Berita tidak ditemukan.', 404);
    }

    public function create()
    {
        if (!isset($_POST['title'], $_POST['content'], $_POST['category_id'])) {
            return ResponseHandler::sendError('Semua data wajib diisi.', 400);
        }

        $title = trim($_POST['title']);
        $content = trim($_POST['content']);
        $category_id = $_POST['category_id'];

        if (strlen($title) < 3) {
            return ResponseHandler::sendError('Judul minimal 3 karakter.', 400);
        }

        if (is_numeric($category_id)) {
            return ResponseHandler::sendError('Kategori tidak valid.', 400);
        }

        if (strlen(strip_tags($content)) < 10) {
            return ResponseHandler::sendError('Konten minimal 10 karakter.', 400);
        }

        $featuredImagePath = null;
        if (isset($_FILES['featured_image']) && $_FILES['featured_image']['error'] === UPLOAD_ERR_OK) {
            $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            $fileType = mime_content_type($_FILES['featured_image']['tmp_name']);

            if (!in_array($fileType, $allowedTypes)) {
                return ResponseHandler::sendError('Hanya gambar JPEG, PNG, atau WEBP yang diperbolehkan.', 400);
            }

            if ($_FILES['featured_image']['size'] > 2 * 1024 * 1024) {
                return ResponseHandler::sendError('Ukuran gambar maksimal 2MB.', 400);
            }

            $uploadDir = __DIR__ . '/../../public/uploads/';
            $ext = pathinfo($_FILES['featured_image']['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . strtolower($ext);
            $target = $uploadDir . $filename;

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            if (!move_uploaded_file($_FILES['featured_image']['tmp_name'], $target)) {
                return ResponseHandler::sendError('Gagal menyimpan gambar.', 500);
            }

            $featuredImagePath = '/uploads/' . $filename;
        }

        $slug = $this->generateSlug($title);
        $excerpt = $_POST['excerpt'] ?? null;
        $is_published = $_POST['is_published'] ?? true;
        $published_at = $is_published ? date('Y-m-d H:i:s') : null;
        $author_id = $_SERVER['auth']['user_id'];

        $success = $this->news->insert([
            'title' => $title,
            'slug' => $slug,
            'content' => $content,
            'excerpt' => $excerpt,
            'featured_image' => $featuredImagePath,
            'author_id' => $author_id,
            'is_published' => $is_published,
            'published_at' => $published_at,
            'category_id' => $category_id
        ]);

        if ($success) {
            return ResponseHandler::sendResponse(null, 'Berita berhasil ditambahkan', 201);
        }

        return ResponseHandler::sendError('Gagal menambahkan berita.', 500);
    }
    public function partialUpdate($id)
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            ResponseHandler::sendError("Data tidak valid", 400);
            return;
        }

        try {
            $this->news->partialUpdate($id, $data);
            ResponseHandler::sendResponse(null, "Data berhasil diperbarui sebagian");
        } catch (\Exception $e) {
            ResponseHandler::sendError($e->getMessage(), 500);
        }
    }

    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['title']) || empty($data['content']) || empty($data['category_id'])) {
            return ResponseHandler::sendError('Judul, konten, dan kategori wajib diisi.', 400);
        }

        $title = trim($data['title']);
        $content = trim($data['content']);
        $category_id = $data['category_id'];

        if (strlen($title) < 3) {
            return ResponseHandler::sendError('Judul minimal 3 karakter.', 400);
        }

        if (is_numeric($category_id)) {
            return ResponseHandler::sendError('Kategori tidak valid.', 400);
        }

        if (strlen(strip_tags($content)) < 10) {
            return ResponseHandler::sendError('Konten minimal 10 karakter.', 400);
        }

        $slug = $this->generateSlug($title);
        $excerpt = $data['excerpt'] ?? null;
        $featured_image = $data['featured_image'] ?? null;
        $is_published = $data['is_published'] ?? true;
        $published_at = $is_published ? date('Y-m-d H:i:s') : null;

        $success = $this->news->update($id, [
            'title' => $title,
            'slug' => $slug,
            'content' => $content,
            'excerpt' => $excerpt,
            'featured_image' => $featured_image,
            'is_published' => $is_published,
            'published_at' => $published_at,
            'category_id' => $category_id
        ]);

        if ($success) {
            return ResponseHandler::sendResponse(null, 'Berita berhasil diperbarui');
        }

        return ResponseHandler::sendError('Gagal memperbarui berita.', 500);
    }

    public function delete($id)
    {
        $success = $this->news->delete($id);

        if ($success) {
            return ResponseHandler::sendResponse(null, 'Berita berhasil dihapus');
        }

        return ResponseHandler::sendError('Gagal menghapus berita', 500);
    }

    private function generateSlug($title)
    {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        return $slug . '-' . time();
    }
}
