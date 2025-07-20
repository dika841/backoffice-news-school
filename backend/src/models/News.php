<?php

namespace App\Models;

use PDO;
use Ramsey\Uuid\Uuid;

class News
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getFilteredNews($page, $limit, $search, $categorySlug, $author, $sort)
    {
        $offset = ($page - 1) * $limit;

        $sql = "SELECT n.*, u.username AS author_username, c.name AS category_name, c.slug AS category_slug
                FROM news n
                JOIN users u ON n.author_id = u.id
                JOIN categories c ON n.category_id = c.id
                WHERE 1=1";

        $params = [];

        if (!empty($search)) {
            $sql .= " AND (n.title LIKE :search OR n.content LIKE :search)";
            $params[':search'] = "%$search%";
        }

        if (!empty($categorySlug)) {
            $sql .= " AND c.slug = :category";
            $params[':category'] = $categorySlug;
        }

        if (!empty($author)) {
            $sql .= " AND u.username = :author";
            $params[':author'] = $author;
        }

        switch ($sort) {
            case 'title_asc':
                $sql .= " ORDER BY n.title ASC";
                break;
            case 'title_desc':
                $sql .= " ORDER BY n.title DESC";
                break;
            case 'published_at_asc':
                $sql .= " ORDER BY n.published_at ASC";
                break;
            default:
                $sql .= " ORDER BY n.published_at DESC";
        }

        $sql .= " LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($sql);

        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }

        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $countStmt = $this->conn->prepare("SELECT COUNT(*) FROM news");
        $countStmt->execute();
        $total = $countStmt->fetchColumn();

        return [
            'page' => $page,
            'limit' => $limit,
            'total' => (int)$total,
            'data' => $results
        ];
    }

    public function insert($data)
    {
        $data['id'] = Uuid::uuid4()->toString();

        $sql = "INSERT INTO news (
            id, title, slug, content, excerpt, featured_image, author_id, is_published, published_at, category_id
        ) VALUES (
            :id, :title, :slug, :content, :excerpt, :featured_image, :author_id, :is_published, :published_at, :category_id
        )";

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ':id' => $data['id'],
            ':title' => $data['title'],
            ':slug' => $data['slug'],
            ':content' => $data['content'],
            ':excerpt' => $data['excerpt'],
            ':featured_image' => $data['featured_image'],
            ':author_id' => $data['author_id'],
            ':is_published' => $data['is_published'],
            ':published_at' => $data['published_at'],
            ':category_id' => $data['category_id']
        ]);
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

        $sql = "UPDATE news SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $this->conn->prepare($sql);

        if (!$stmt->execute($params)) {
            throw new \Exception("Gagal memperbarui data");
        }

        return true;
    }

    public function update($id, $data)
    {
        $sql = "UPDATE news SET 
                title = :title,
                slug = :slug,
                content = :content,
                excerpt = :excerpt,
                featured_image = :featured_image,
                is_published = :is_published,
                published_at = :published_at,
                category_id = :category_id,
                updated_at = NOW()
            WHERE id = :id";

        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':title' => $data['title'],
            ':slug' => $data['slug'],
            ':content' => $data['content'],
            ':excerpt' => $data['excerpt'],
            ':featured_image' => $data['featured_image'],
            ':is_published' => $data['is_published'],
            ':published_at' => $data['published_at'],
            ':category_id' => $data['category_id']
        ]);
    }

    public function getByIdWithCategory($id)
    {
        $sql = "SELECT n.*, c.id AS category_id, c.name AS category_name, c.slug AS category_slug
                FROM news n
                JOIN categories c ON n.category_id = c.id
                WHERE n.id = :id
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM news WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
