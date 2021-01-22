package project.ranker.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

@SuppressWarnings("serial")
@Entity
@Table(name = "options")
public class Option extends AuditModel {

	@Id
    @GeneratedValue(generator = "option_generator")
    @SequenceGenerator(
            name = "option_generator",
            sequenceName = "option_sequence",
            initialValue = 1000
    )
    private Long id;
	
	@ManyToOne
	@JoinColumn(name="category_id", nullable=false)
	@JsonBackReference
	private Category category;
	
	@Column
	private String name;
	
	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}
}
