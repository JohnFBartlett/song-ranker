package project.ranker.exceptions;

@SuppressWarnings("serial")
public class OptionNotFoundException extends Exception {

	public OptionNotFoundException(String id) {
		super("Could not find Water point with ID" + id); 
	}
}
