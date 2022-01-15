package project.ranker.controller;

import org.springframework.web.bind.annotation.RestController;

import project.ranker.exceptions.CategoryNotFoundException;
import project.ranker.exceptions.OptionNotFoundException;
import project.ranker.exceptions.RankSessionNotFoundException;
import project.ranker.model.Category;
import project.ranker.model.Option;
import project.ranker.model.OptionScore;
import project.ranker.model.RankSession;
import project.ranker.model.SpotifyCredentials;
import project.ranker.objects.DataResponse;
import project.ranker.repositories.CategoryRepository;
import project.ranker.repositories.OptionRepository;
import project.ranker.repositories.OptionScoreRepository;
import project.ranker.repositories.RankSessionRepository;
import project.ranker.repositories.SpotifyCredentialsRepository;

import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
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
@RequestMapping("credentials")
public class CredentialsController {
	
	@Autowired
	private SpotifyCredentialsRepository credentialsRepository;
	
	final static String DATA_SUCCESS = "Successfully added data to the DB.";
	final static String DATA_FAIL = "Failed to add data to the DB";
	final static String DELETE_SUCCESS = "Successfully deleted data from the DB";
	final static String DELETE_FAIL = "Failed to delete data from the DB";
	
	public enum FailReasons {
		FORMAT_ERROR
	}
	
	@GetMapping("")
	public ResponseEntity<SpotifyCredentials> getByName(@RequestParam(value = "name", required = true) String name) {
		List<SpotifyCredentials> credSearch = credentialsRepository.findByName(name);
		if (credSearch.size() == 1) {
			return new ResponseEntity<>(credSearch.get(0), HttpStatus.OK);
		}
		return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	}
	
	@PostMapping(path = "", produces = "application/json")
	public DataResponse addCreds(@RequestBody Map<String, String> data) {
		String name = data.get("name");
		String clientId = data.get("clientId");
		String clientSecret = data.get("clientSecret");
		
		
		System.out.println("args " + name + " cl " + clientId + " sec " + clientSecret);
		
		if (name != null && clientId != null && clientSecret != null) {
			SpotifyCredentials creds = new SpotifyCredentials();
			creds.setName(name);
			creds.setClientId(clientId);
			creds.setClientSecret(clientSecret);
			credentialsRepository.save(creds);
				
			DataResponse response = new DataResponse();
			response.setResponseStatus(DATA_SUCCESS);
			
			return response;
		}
		
		return null;
	}
}
