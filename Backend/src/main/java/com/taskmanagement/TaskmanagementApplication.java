package com.taskmanagement;

import com.taskmanagement.entity.User;
import com.taskmanagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;

@SpringBootApplication
public class TaskmanagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskmanagementApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadData(UserRepository userRepository) {
		return args -> {
			if (userRepository.count() == 0) {
				User admin = new User();
				admin.setUsername("admin1");
				admin.setRole("ADMIN");

				User user1 = new User();
				user1.setUsername("user1");
				user1.setRole("USER");

				User user2 = new User();
				user2.setUsername("user2");
				user2.setRole("USER");

				userRepository.saveAll(Arrays.asList(admin, user1, user2));
				System.out.println("Inserted default users into database");
			}
		};
	}
}
