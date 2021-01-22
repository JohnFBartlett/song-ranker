package project.ranker.exceptions;

@SuppressWarnings("serial")
public class CategoryNotFoundException extends Exception {

	public CategoryNotFoundException(String id) {
		super("Could not find Water point with ID" + id); 
	}
}
