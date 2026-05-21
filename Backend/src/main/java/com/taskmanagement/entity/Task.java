package com.taskmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private String status; // 'PENDING', 'IN_PROGRESS', 'COMPLETED'

    @ManyToOne
    @JoinColumn(name = "locked_by")
    private User lockedBy;
}
