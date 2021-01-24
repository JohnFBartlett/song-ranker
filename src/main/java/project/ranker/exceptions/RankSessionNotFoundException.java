package project.ranker.exceptions;

@SuppressWarnings("serial")
public class RankSessionNotFoundException extends Exception {

	public RankSessionNotFoundException(String id) {
		super("Could not find Water point with ID" + id); 
	}
}
