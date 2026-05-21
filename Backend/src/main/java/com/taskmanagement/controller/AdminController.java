package com.taskmanagement.controller;

import com.taskmanagement.entity.Task;
import com.taskmanagement.service.TaskService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/tasks")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequest request) {
        Task task = taskService.createTask(request.getTitle(), request.getDescription(), request.getUserIds());
        return ResponseEntity.ok(Map.of("message", "Task created and assigned successfully", "task", task));
    }

    // {
    // "message": "Task created and assigned successfully",
    // "task": {
    // "id": 5,
    // "title": "Fix Login API",
    // "status": "PENDING"
    // }
    // }

    // ResponseEntity<?> sent this response to frontend

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }
}

@Data
class TaskRequest {
    private String title;
    private String description;
    private List<Long> userIds;
}
