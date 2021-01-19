package project.water.watermap.objects;

import java.util.List;

import lombok.Data;

@Data
public class DataResponse {

	private String responseStatus;
	
	private Integer numSaved;
	
	private Integer numUpdated;
	
	private Integer numRejected;
	
	private List<Long> createdIds;
	
	private List<Long> updatedIds;
	
	public String getResponseStatus() {
		return responseStatus;
	}

	public void setResponseStatus(String responseStatus) {
		this.responseStatus = responseStatus;
	}

	public Integer getNumSaved() {
		return numSaved;
	}

	public void setNumSaved(Integer numSaved) {
		this.numSaved = numSaved;
	}

	public Integer getNumUpdated() {
		return numUpdated;
	}

	public void setNumUpdated(Integer numUpdated) {
		this.numUpdated = numUpdated;
	}

	public Integer getNumRejected() {
		return numRejected;
	}

	public void setNumRejected(Integer numRejected) {
		this.numRejected = numRejected;
	}

	public List<Long> getCreatedIds() {
		return createdIds;
	}

	public void setCreatedIds(List<Long> createdIds) {
		this.createdIds = createdIds;
	}

	public List<Long> getUpdatedIds() {
		return updatedIds;
	}

	public void setUpdatedIds(List<Long> updatedIds) {
		this.updatedIds = updatedIds;
	}
}
