package com.taskmanagement.repository;

import com.taskmanagement.entity.WorkEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkEntryRepository extends JpaRepository<WorkEntry, Long> {
    boolean existsByTaskId(Long taskId);
}
