<?php

namespace App\Models;

use PDO;
use Ramsey\Uuid\Uuid;

class Announcement
{
    private $conn;
    private $table = 'announcements';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getFilteredAnnouncements($page, $limit, $search, $category, $author, $sort, $start, $end)
    {
        $offset = ($page - 1) * $limit;
        $sortOrder = strtoupper(str_contains($sort, 'asc') ? 'ASC' : 'DESC');
        $sortField = str_contains($sort, 'start_date') ? 'a.start_date' : 'a.created_at';

        $baseSql = "FROM {$this->table} a
                JOIN users u ON a.author_id = u.id
                JOIN categories c ON a.category_id = c.id
                WHERE 1=1";

        $bindings = [];

        if (!empty($search)) {
            $baseSql .= " AND (a.title LIKE :search OR a.content LIKE :search)";
            $bindings[':search'] = "%$search%";
        }

        if (!empty($category)) {
            $baseSql .= " AND c.slug = :category";
            $bindings[':category'] = $category;
        }

        if (!empty($author)) {
            $baseSql .= " AND a.author_id = :author";
            $bindings[':author'] = $author;
        }

        if (!empty($start)) {
            $baseSql .= " AND a.start_date >= :start";
            $bindings[':start'] = $start;
        }

        if (!empty($end)) {
            $baseSql .= " AND a.end_date <= :end";
            $bindings[':end'] = $end;
        }

        // Count total
        $countStmt = $this->conn->prepare("SELECT COUNT(*) as total " . $baseSql);
        foreach ($bindings as $key => $val) {
            $countStmt->bindValue($key, $val);
        }
        $countStmt->execute();
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Fetch paginated data
        $dataSql = "SELECT a.*, u.username AS author, c.name AS category_name, c.slug AS category_slug
                $baseSql
                ORDER BY $sortField $sortOrder
                LIMIT :limit OFFSET :offset";
        $stmt = $this->conn->prepare($dataSql);
        foreach ($bindings as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'data' => $data,
            'total' => (int)$total,
            'page' => (int)$page,
            'limit' => (int)$limit
        ];
    }

    public function getBySlug($slug)
    {
        $sql = "SELECT a.*, u.username AS author, c.id AS category_id, c.name AS category_name, c.slug AS category_slug
            FROM {$this->table} a
            JOIN users u ON a.author_id = u.id
            JOIN categories c ON a.category_id = c.id
            WHERE a.slug = :slug
            LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function insert($data)
    {
        $data['id'] = Uuid::uuid4()->toString();

        $sql = "INSERT INTO {$this->table} 
    (id, title, slug, content, author_id, is_important, start_date, end_date, category_id, featured_image)
    VALUES (:id, :title, :slug, :content, :author_id, :is_important, :start_date, :end_date, :category_id, :featured_image)";


        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }

    public function update($id, $data)
    {
        $fields = [];
        foreach ($data as $key => $value) {
            $fields[] = "$key = :$key";
        }
        $sql = "INSERT INTO {$this->table} 
    (id, title, slug, content, author_id, is_important, start_date, end_date, category_id, featured_image)
    VALUES (:id, :title, :slug, :content, :author_id, :is_important, :start_date, :end_date, :category_id, :featured_image)";

        $data['id'] = $id;

        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }
    public function partialUpdate($id, $data)
    {
        if (empty($data)) {
            throw new \Exception("Tidak ada data untuk diperbarui");
        }

        $fields = [];
        $params = [];

        foreach ($data as $key => $value) {
            $fields[] = "$key = ?";
            $params[] = $value;
        }

        $params[] = $id;

        $sql = "UPDATE {$this->table} SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->conn->prepare($sql);

        if (!$stmt->execute($params)) {
            throw new \Exception("Gagal memperbarui data");
        }

        return true;
    }
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
