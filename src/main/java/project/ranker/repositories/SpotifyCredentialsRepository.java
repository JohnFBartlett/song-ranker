package project.ranker.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project.ranker.model.Category;
import project.ranker.model.SpotifyCredentials;

@Repository 
public interface SpotifyCredentialsRepository extends JpaRepository<SpotifyCredentials, Long> {
	List<SpotifyCredentials> findByName(String name);
}
