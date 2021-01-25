package project.ranker.controller;

import org.springframework.web.bind.annotation.RestController;

import project.ranker.exceptions.CategoryNotFoundException;
import project.ranker.exceptions.OptionNotFoundException;
import project.ranker.exceptions.RankSessionNotFoundException;
import project.ranker.model.Category;
import project.ranker.model.Option;
import project.ranker.model.OptionScore;
import project.ranker.model.RankSession;
import project.ranker.objects.DataResponse;
import project.ranker.repositories.CategoryRepository;
import project.ranker.repositories.OptionRepository;
import project.ranker.repositories.OptionScoreRepository;
import project.ranker.repositories.RankSessionRepository;

import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("ranking")
public class RankSessionController {
	
	@Autowired
	private OptionScoreRepository optionScoreRepository;
	
	@Autowired
	private RankSessionRepository rankSessionRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	final static String DATA_SUCCESS = "Successfully added data to the DB.";
	final static String DATA_FAIL = "Failed to add data to the DB";
	final static String DELETE_SUCCESS = "Successfully deleted data from the DB";
	final static String DELETE_FAIL = "Failed to delete data from the DB";
	
	private String delete_success(long id) {
		return String.format("Successfully deleted rank session %d from the DB", id);
	}
	
	private String delete_not_found(long id) {
		return String.format("Could not find rank session %d to delete", id);
	}
	
	private String nothing_found() {
		return "Could not find any rank sessions to delete";
	}
	
	private String delete_failed(long id) {
		return String.format("Could not delete rank session %d from the DB", id);
	}
	
	public enum FailReasons {
		FORMAT_ERROR
	}
	
	public void linkRankSession(RankSession rankSession, List<OptionScore> optionScores) {
	    for (OptionScore optionScore : optionScores) {
	        optionScore.setRankSession(rankSession);
	    }
	}
	
	@GetMapping("")
	public ResponseEntity<List<RankSession>> getAll() {
		List<RankSession> sessions = rankSessionRepository.findAll();
		return new ResponseEntity<>(sessions, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public RankSession getSingleSession(@PathVariable long id) throws RankSessionNotFoundException {
		Optional<RankSession> session = rankSessionRepository.findById(id);

		if (!session.isPresent())
			throw new RankSessionNotFoundException("id-" + id);

		return session.get();
	}
	
	@GetMapping("/category/{id}")
	public ResponseEntity<List<RankSession>> getSessionsForCategory(
			@PathVariable long id) throws CategoryNotFoundException {
		System.out.println("Getting sessions for category");
		Optional<Category> categorySearch = categoryRepository.findById(id);
		if (!categorySearch.isPresent())
			throw new CategoryNotFoundException("id-" + id);
		Category category = categorySearch.get();
		System.out.println("got category: " + category.toString());
		
		List<RankSession> rankSessions = category.getRankSessions();
		System.out.println("Got " + String.valueOf(rankSessions.size()) + " rank sessions");

		return new ResponseEntity<>(category.getRankSessions(), HttpStatus.OK);
	}
	
	@PostMapping(path = "", produces = "application/json")
	public ResponseEntity<RankSession> addRankSession(@RequestBody RankSession rankSession) {
		
		System.out.println(rankSession.toString());
		
		RankSession created = rankSessionRepository.save(rankSession);
		
		return new ResponseEntity<>(created, HttpStatus.OK);
	}
	
	@DeleteMapping(path = "/{id}", produces = "application/json")
	public String deleteData(@PathVariable long id) {
		try {
			Optional<RankSession> session = rankSessionRepository.findById(id);

			if (!session.isPresent())
				throw new RankSessionNotFoundException("id-" + id);
			RankSession rankSession = session.get();
			List<OptionScore> optionScores = rankSession.getOptionScores();
			optionScoreRepository.deleteAll(optionScores);
			rankSessionRepository.delete(rankSession);
		} catch (EmptyResultDataAccessException e) {
			return delete_not_found(id);
		} catch (Exception e) {
			return delete_failed(id);
		}
		
		return delete_success(id);
	}
}
