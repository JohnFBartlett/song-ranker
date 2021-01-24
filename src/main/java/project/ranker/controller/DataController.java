package project.ranker.controller;

import org.springframework.web.bind.annotation.RestController;

import project.ranker.exceptions.CategoryNotFoundException;
import project.ranker.exceptions.OptionNotFoundException;
import project.ranker.model.Category;
import project.ranker.model.Option;
import project.ranker.objects.DataResponse;
import project.ranker.repositories.CategoryRepository;
import project.ranker.repositories.OptionRepository;

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
@RequestMapping("data")
public class DataController {
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private OptionRepository optionRepository;
	
	final static String DATA_SUCCESS = "Successfully added data to the DB.";
	final static String DATA_FAIL = "Failed to add data to the DB";
	final static String DELETE_SUCCESS = "Successfully deleted data from the DB";
	final static String DELETE_FAIL = "Failed to delete data from the DB";
	
	private String delete_success(long id) {
		return String.format("Successfully deleted category %d from the DB", id);
	}
	
	private String delete_not_found(long id) {
		return String.format("Could not find category %d to delete", id);
	}
	
	private String nothing_found() {
		return "Could not find any categories to delete";
	}
	
	private String delete_failed(long id) {
		return String.format("Could not delete category %d from the DB", id);
	}
	
	public enum FailReasons {
		FORMAT_ERROR
	}

	public void linkCategory(Category category, List<Option> options) {
	    for (Option option : options) {
	        option.setCategory(category);
	    }
	}
	
	@GetMapping("")
	public String index() {
		return "Greetings from Data Controller!";
	}
	
	@GetMapping("/categories")
	public List<Category> getCategories() {
		System.out.println("Requested categories");
		return categoryRepository.findAll();
	}
	
	@GetMapping("/categories/{id}")
	public Category getSingleCategory(@PathVariable long id) throws CategoryNotFoundException {
		Optional<Category> category = categoryRepository.findById(id);

		if (!category.isPresent())
			throw new CategoryNotFoundException("id-" + id);

		return category.get();
	}
	
	@PostMapping(path = "/categories", produces = "application/json")
	public ResponseEntity<Category> addCategory(@RequestBody Category category) {
		
		System.out.println(category.toString());
		linkCategory(category, category.getOptions());
		
		Category created = categoryRepository.save(category);
		
		return new ResponseEntity<>(created, HttpStatus.OK);
	}

//	@PostMapping(path = "/categories", produces = "application/json")
//	public DataResponse addData(@RequestBody List<Category> categories) {
//		
//		for (Category category : categories) {
//			System.out.println(category.toString());
//			linkCategory(category, category.getOptions());
//		}
//		
//		List<Category> created = categoryRepository.saveAll(categories);
//		int numCreated = created.size();
//		int updated = 0;
//		
//		List<Long> ids = new ArrayList<>();
//		for (Category category: created) {
//			ids.add(category.getId());
//		}
//		
//		DataResponse response = new DataResponse();
//		response.setNumSaved(numCreated);
//		response.setNumUpdated(updated);
//		response.setCreatedIds(ids);
//		response.setNumRejected(0);
//		response.setResponseStatus(DATA_SUCCESS);
//		
//		return response;
//	}
	
	@DeleteMapping(path = "/categories/{id}", produces = "application/json")
	public String deleteData(@PathVariable long id) {
		try {
			categoryRepository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			return delete_not_found(id);
		} catch (Exception e) {
			return delete_failed(id);
		}
		
		return delete_success(id);
	}
	

	@DeleteMapping(path = "/categories", produces = "application/json")
	public String deleteAllData() {
		try {
			categoryRepository.deleteAll();;
		} catch (EmptyResultDataAccessException e) {
			return nothing_found();
		} catch (Exception e) {
			return DELETE_FAIL;
		}
		
		return DELETE_SUCCESS;
	}
	
	@DeleteMapping(path = "/options", produces = "application/json")
	public String deleteAllOptions() {
		try {
			optionRepository.deleteAll();;
		} catch (EmptyResultDataAccessException e) {
			return nothing_found();
		} catch (Exception e) {
			return DELETE_FAIL;
		}
		
		return DELETE_SUCCESS;
	}
	
	@GetMapping("/options")
	public List<Option> getOptions(
			@RequestParam(value = "categoryId", required = true) String categoryId) throws CategoryNotFoundException {
		if (categoryId != null) {
			Optional<Category> category = categoryRepository.findById(Long.getLong(categoryId));
			if (!category.isPresent())
				throw new CategoryNotFoundException("id-" + categoryId);

			return category.get().getOptions();
		}
		return null;
	}
	
	@GetMapping("/options/{id}")
	public Option getSingleOption(@PathVariable long id) throws OptionNotFoundException {
		Optional<Option> option = optionRepository.findById(id);

		if (!option.isPresent())
			throw new OptionNotFoundException("id-" + id);

		return option.get();
	}
	
	@PutMapping(path = "/options", produces = "application/json")
	public ResponseEntity<String> addOptions(
			@RequestBody Option option) {
		
		Optional<Option> optionSearch = optionRepository.findById(option.getId());
		
		if (optionSearch.isPresent()) {
			optionRepository.save(option);
		} else {
			return new ResponseEntity<>(
				"Could not find option to update", 
				HttpStatus.NOT_FOUND
			);
		}
		
		return new ResponseEntity<>(
			"Updated option",
			HttpStatus.OK
		);
	}
	
	@PostMapping(path = "/options", produces = "application/json")
	public DataResponse addOptions(
			@RequestBody String categoryId,
			List<Option> options) {
		
		if (categoryId != null) {
			Optional<Category> categorySearch = categoryRepository.findById(Long.getLong(categoryId));
			if (categorySearch.isPresent()) {
				Category category = categorySearch.get();
				for (Option option : options) {
					option.setCategory(category);
				}
				
				int created = optionRepository.saveAll(options).size();
				int updated = 0;
				
				DataResponse response = new DataResponse();
				response.setNumSaved(created);
				response.setNumUpdated(updated);
				response.setNumRejected(0);
				response.setResponseStatus(DATA_SUCCESS);
				
				return response;
			}
		}
		
		return null;
	}
}
