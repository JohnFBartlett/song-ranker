package project.ranker.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "categories")
public class Category extends AuditModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4981139907658637165L;

	@Id
    @GeneratedValue(generator = "category_generator")
    @SequenceGenerator(
            name = "category_generator",
            sequenceName = "category_sequence",
            initialValue = 1000
    )
    private Long id;
	
	@Column
	private String name;
	
	@Column
	private String type;

	@OneToMany(
		mappedBy="category",
		cascade=CascadeType.ALL)
	@JsonManagedReference(value="categoryOptions")
	private List<Option> options;
	
	@OneToMany(
		mappedBy="category",
		cascade=CascadeType.ALL)
	@JsonBackReference(value="rankSessionCategory")
	private List<RankSession> rankSessions;

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<Option> getOptions() {
		return options;
	}

	public void setOptions(List<Option> options) {
		this.options = options;
	}
	
	public void addOption(Option option) {
		if (this.options == null) {
			this.options = new ArrayList<Option>();
		}
		this.options.add(option);
	}

	public List<RankSession> getRankSessions() {
		return rankSessions;
	}

	public void setRankSessions(List<RankSession> rankSessions) {
		this.rankSessions = rankSessions;
	}
	
	public void addRankSession(RankSession rankSession) {
		if (this.rankSessions == null) {
			this.rankSessions = new ArrayList<RankSession>();
		}
		this.rankSessions.add(rankSession);
	}
}
