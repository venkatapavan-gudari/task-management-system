package com.taskmanagement.service;

import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.TaskAssignment;
import com.taskmanagement.entity.User;
import com.taskmanagement.entity.WorkEntry;
import com.taskmanagement.repository.TaskAssignmentRepository;
import com.taskmanagement.repository.TaskRepository;
import com.taskmanagement.repository.UserRepository;
import com.taskmanagement.repository.WorkEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskAssignmentRepository taskAssignmentRepository;

    @Autowired
    private WorkEntryRepository workEntryRepository;

    @Transactional
    public Task createTask(String title, String description, List<Long> userIds) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setStatus("PENDING");
        Task savedTask = taskRepository.save(task);

        if (userIds != null) {
            for (Long userId : userIds) {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
                TaskAssignment assignment = new TaskAssignment();
                assignment.setTask(savedTask);
                assignment.setUser(user);
                taskAssignmentRepository.save(assignment);
            }
        }
        return savedTask;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Task> getAssignedTasks(Long userId) {
        List<TaskAssignment> assignments = taskAssignmentRepository.findByUserId(userId);
        return assignments.stream().map(TaskAssignment::getTask).collect(Collectors.toList());
    }

    @Transactional
    public void lockTask(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                // SELECT * FROM tasks WHERE id = 5;
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        User user = userRepository.findById(userId)
                // SELECT * FROM users WHERE id = 2;
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (task.getLockedBy() == null) {
            task.setLockedBy(user);
            task.setStatus("IN_PROGRESS");
            taskRepository.save(task);
            // UPDATE tasks SET locked_by = 2, status = 'IN_PROGRESS' WHERE id = 5;
        } else if (!task.getLockedBy().getId().equals(userId)) {
            throw new RuntimeException("Task is already being worked on by someone else");
        }
    }

    @Transactional
    public void addWorkEntry(Long userId, Long taskId, LocalDate workDate, String workTime) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (task.getLockedBy() == null || !task.getLockedBy().getId().equals(userId)) {
            throw new RuntimeException("You must lock the task before adding a work entry");

        }

        WorkEntry entry = new WorkEntry();
        entry.setTask(task);
        entry.setUser(user);
        entry.setWorkDate(workDate);
        entry.setWorkTime(workTime);
        entry.setUsername(user.getUsername());
        workEntryRepository.save(entry);
    }

    @Transactional
    public void completeTask(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (task.getLockedBy() == null || !task.getLockedBy().getId().equals(userId)) {
            throw new RuntimeException("You can only complete a task you have locked");
        }

        if (!workEntryRepository.existsByTaskId(taskId)) {
            // SELECT EXISTS(
            // SELECT *
            // FROM work_entries
            // WHERE task_id = 5
            // );
            throw new RuntimeException("⚠️ Please add at least one work entry before completing the task.");
        }

        task.setStatus("COMPLETED");
        taskRepository.save(task);
        // UPDATE tasks
        // SET status = 'COMPLETED'
        // WHERE id = 5;
    }
}
