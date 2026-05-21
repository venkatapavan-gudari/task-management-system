package com.taskmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "work_entries")
public class WorkEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id") // one task can have many work_entires(task_id is foreign key)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "user_id") // one user can have many work entries(user_id is foreign key)
    private User user;

    private LocalDate workDate;

    private String workTime;
}
