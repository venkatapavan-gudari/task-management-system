package com.taskmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "task_assignments")
public class TaskAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id") // foreign key task_id
    private Task task;

    @ManyToOne
    @JoinColumn(name = "user_id") // foreign key user_id
    private User user;
}
