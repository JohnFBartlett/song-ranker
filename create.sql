create sequence water_measurement_sequence start 1000 increment 50
create sequence water_source_sequence start 1000 increment 50
create table water_measurements (id int8 not null, created_at timestamp not null, updated_at timestamp not null, date_collected timestamp, date_measured timestamp, height float8, volume float8, source_id int8 not null, primary key (id))
create table water_sources (id int8 not null, created_at timestamp not null, updated_at timestamp not null, date_found timestamp, name varchar(255), square_footage float8, type varchar(255), x_coor float8, y_coor float8, primary key (id))
alter table water_measurements add constraint FK9072nifo898ld4yaaifn90gvy foreign key (source_id) references water_sources
