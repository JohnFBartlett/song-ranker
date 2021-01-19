package project.water.watermap.exceptions;

@SuppressWarnings("serial")
public class WaterPointNotFoundException extends Exception {

	public WaterPointNotFoundException(String id) {
		super("Could not find Water point with ID" + id); 
	}
}
