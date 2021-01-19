package project.water.watermap.objects;

import java.io.Serializable;
import java.util.Date;

public class WaterSourceDTO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String type;
	
	private String name;
	
	private Date dateFound;
	
	private Double xCoor;
	
	private Double yCoor;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getDateFound() {
		return dateFound;
	}

	public void setDateFound(Date dateFound) {
		this.dateFound = dateFound;
	}

	public Double getxCoor() {
		return xCoor;
	}

	public void setxCoor(Double xCoor) {
		this.xCoor = xCoor;
	}

	public Double getyCoor() {
		return yCoor;
	}

	public void setyCoor(Double yCoor) {
		this.yCoor = yCoor;
	}
}
