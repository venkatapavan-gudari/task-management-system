package com.taskmanagement.controller;

import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.User;
import com.taskmanagement.service.TaskService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(taskService.getAllUsers());
    }

    @GetMapping("/{userId}/tasks")
    public ResponseEntity<List<Task>> getAssignedTasks(@PathVariable Long userId) {
        return ResponseEntity.ok(taskService.getAssignedTasks(userId));
    }

    // [
    // {
    // "id": 5,
    // "title": "Fix Login API",
    // "status": "PENDING"
    // },
    // {
    // "id": 7,
    // "title": "Payment Bug",
    // "status": "IN_PROGRESS"
    // }
    // ] ResponseEntity send this json data to frontend

    @PostMapping("/{userId}/tasks/{taskId}/lock")
    public ResponseEntity<?> lockTask(@PathVariable Long userId, @PathVariable Long taskId) {
        try {
            taskService.lockTask(userId, taskId);
            return ResponseEntity.ok(Map.of("message", "Task locked successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{userId}/tasks/{taskId}/work-entries")
    public ResponseEntity<?> addWorkEntry(@PathVariable Long userId, @PathVariable Long taskId,
            @RequestBody WorkEntryRequest request) {
        try {
            taskService.addWorkEntry(userId, taskId, request.getWorkDate(), request.getWorkTime());
            return ResponseEntity.ok(Map.of("message", "Work entry added successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

        // { json data
        // "error":
        // "You must lock the task before adding a work entry"
        // }
    }

    @PostMapping("/{userId}/tasks/{taskId}/complete")
    public ResponseEntity<?> completeTask(@PathVariable Long userId, @PathVariable Long taskId) {
        try {
            taskService.completeTask(userId, taskId);
            return ResponseEntity.ok(Map.of("message", "Task completed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

@Data
class WorkEntryRequest {
    private LocalDate workDate;
    private String workTime;
}
