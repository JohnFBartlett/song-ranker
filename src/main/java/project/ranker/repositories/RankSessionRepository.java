package project.ranker.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.ranker.model.RankSession;

@Repository 
public interface RankSessionRepository extends JpaRepository<RankSession, Long> {

}
