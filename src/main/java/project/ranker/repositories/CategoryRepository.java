package project.ranker.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.ranker.model.Category;

@Repository 
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
