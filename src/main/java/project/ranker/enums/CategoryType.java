package project.ranker.enums;

public enum CategoryType {
	SONG("song");
	
	private String name;
	
	private CategoryType(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
}
