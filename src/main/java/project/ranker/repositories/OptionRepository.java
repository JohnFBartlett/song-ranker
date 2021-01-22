package project.ranker.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.ranker.model.Option;

@Repository 
public interface OptionRepository extends JpaRepository<Option, Long> {

}
