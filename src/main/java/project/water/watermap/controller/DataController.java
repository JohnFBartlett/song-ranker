package project.water.watermap.controller;

import org.springframework.web.bind.annotation.RestController;

import project.water.watermap.exceptions.WaterPointNotFoundException;
import project.water.watermap.model.WaterMeasurement;
import project.water.watermap.model.WaterSource;
import project.water.watermap.objects.DataResponse;
import project.water.watermap.repositories.WaterMeasurementRepository;
import project.water.watermap.repositories.WaterSourceRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("data")
public class DataController {
	
	@Autowired
	private WaterSourceRepository waterSourceRepository;
	
	@Autowired
	private WaterMeasurementRepository waterMeasurementRepository;
	
	final static String DATA_SUCCESS = "Successfully added data to the DB.";
	final static String DATA_FAIL = "Failed to add data to the DB";
	
	private String delete_success(long id) {
		return String.format("Successfully deleted source %d from the DB", id);
	}
	
	private String delete_not_found(long id) {
		return String.format("Could not find source %d to delete", id);
	}
	
	private String delete_failed(long id) {
		return String.format("Could not delete source %d from the DB", id);
	}
	
	public enum FailReasons {
		FORMAT_ERROR
	}

	public void linkSource(WaterSource source, List<WaterMeasurement> measurements) {
	    for (WaterMeasurement measurement : measurements) {
	        measurement.setSource(source);
	    }
	}
	
	@GetMapping("")
	public String index() {
		return "Greetings from Data Controller!";
	}
	
	@GetMapping("/sources")
	public List<WaterSource> getPoints() {
		System.out.println("Requested water points");
		return waterSourceRepository.findAll();
	}
	
	@GetMapping("/sources/{id}")
	public WaterSource getSinglePoint(@PathVariable long id) throws WaterPointNotFoundException {
		Optional<WaterSource> student = waterSourceRepository.findById(id);

		if (!student.isPresent())
			throw new WaterPointNotFoundException("id-" + id);

		return student.get();
	}

	@PostMapping(path = "/sources", produces = "application/json")
	public DataResponse addData(@RequestBody List<WaterSource> waterSources) {
		
		for (WaterSource ws : waterSources) {
			System.out.println(ws.toString());
			linkSource(ws, ws.getMeasurements());
		}
		
		List<WaterSource> created = waterSourceRepository.saveAll(waterSources);
		int numCreated = created.size();
		int updated = 0;
		
		List<Long> ids = new ArrayList<>();
		for (WaterSource ws : created) {
			ids.add(ws.getId());
		}
		
		DataResponse response = new DataResponse();
		response.setNumSaved(numCreated);
		response.setNumUpdated(updated);
		response.setCreatedIds(ids);
		response.setNumRejected(0);
		response.setResponseStatus(DATA_SUCCESS);
		
		return response;
	}
	
	@DeleteMapping(path = "/sources/{id}", produces = "application/json")
	public String deleteData(@PathVariable long id) {
		try {
			waterSourceRepository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			return delete_not_found(id);
		} catch (Exception e) {
			return delete_failed(id);
		}
		
		return delete_success(id);
	}
	
	@GetMapping("/measurements")
	public List<WaterMeasurement> getMeasurements(
			@RequestParam(value = "sourceId", required = false) String sourceId,
			@RequestParam(value = "startDate", required = false) Date startDate,
			@RequestParam(value = "endDate", required = false) Date endDate) throws WaterPointNotFoundException {
		if (sourceId != null) {
			Optional<WaterSource> source = waterSourceRepository.findById(Long.getLong(sourceId));
			if (!source.isPresent())
				throw new WaterPointNotFoundException("id-" + sourceId);

			if (startDate != null && endDate != null) {
				// TODO: filter source's measurements by date
			}
			return source.get().getMeasurements();
		} else if (startDate != null && endDate != null) {
			// TODO: get all measurements within a date range
		}
		return null;
	}
	
	@PostMapping(path = "/measurements", produces = "application/json")
	public DataResponse addMeasurements(
			@RequestBody String sourceId,
			List<WaterMeasurement> waterMeasurements) {
		
		if (sourceId != null) {
			Optional<WaterSource> sourceSearch = waterSourceRepository.findById(Long.getLong(sourceId));
			if (sourceSearch.isPresent()) {
				WaterSource source = sourceSearch.get();
				for (WaterMeasurement meas : waterMeasurements) {
					meas.setSource(source);
				}
				
				int created = waterMeasurementRepository.saveAll(waterMeasurements).size();
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
