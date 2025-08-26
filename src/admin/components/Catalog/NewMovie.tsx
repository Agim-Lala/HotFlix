import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Form, Input, Select, Button, App, Radio } from "antd";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import {
  createMovie,
  fetchActors,
  fetchCategories,
  fetchDirectors,
  fetchGenres,
  fetchQualities,
  CreateMovieRequest,
} from "../../api/movieApi";
import useQuery from "../../hooks/useQuery";
import styles from "./addMovieForm.module.css";

const { TextArea } = Input;

const AddMovieForm: React.FC = () => {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const { message } = App.useApp();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMovieRequest>();
  const { query: genreQuery } = useQuery(fetchGenres);
  const { query: categoryQuery } = useQuery(fetchCategories);
  const { query: directorQuery } = useQuery(fetchDirectors);
  const { query: actorQuery } = useQuery(fetchActors);
  const { query: qualityQuery } = useQuery(fetchQualities);

  if (
    genreQuery.status === "loading" ||
    categoryQuery.status === "loading" ||
    directorQuery.status === "loading" ||
    actorQuery.status === "loading" ||
    qualityQuery.status === "loading"
  ) {
    return <div>Loading...</div>;
  }

  if (
    genreQuery.status === "error" ||
    categoryQuery.status === "error" ||
    directorQuery.status === "error" ||
    actorQuery.status === "error" ||
    qualityQuery.status === "error"
  ) {
    return <div>Failed to load data</div>;
  }

  const onSubmit: SubmitHandler<CreateMovieRequest> = async (data) => {
    try {
      await createMovie(data);
      message.success("Movie added successfully!");
      console.log("Movie created successfully", data);
    } catch (error) {
      console.error(error);
      message.error("Failed to add movie.");
    }
  };

  const handleCoverChange = (
    files: FileList | null,
    onChange: (files: FileList) => void
  ) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
      onChange(files);
    }
  };

  return (
    <>
      <h1>Add New Movie</h1>
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        className={styles.form}
      >
        <div className={styles.container}>
          <div className={styles.cover}>
            <Form.Item required>
              <Controller
                name="cover"
                control={control}
                rules={{ required: "Cover image is required" }}
                render={({ field }) => (
                  <div
                    onDrop={(e) => {
                      e.preventDefault();
                      handleCoverChange(e.dataTransfer.files, field.onChange);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className={styles.dragArea}
                  >
                    <input
                      type="file"
                      accept="image/"
                      required
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleCoverChange(e.target.files, field.onChange)
                      }
                      id="cover-upload"
                    />
                    {!coverPreview && (
                      <label htmlFor="cover-upload">
                        Upload Cover (270 × 400)
                      </label>
                    )}
                    {coverPreview && (
                      <>
                        <img src={coverPreview} alt="cover preview" />
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => {
                            field.onChange(null);
                            setCoverPreview(null);
                          }}
                        >
                          <CloseOutlined />
                        </button>
                      </>
                    )}
                  </div>
                )}
              />
              {errors.cover && (
                <span className={styles.error}>{errors.cover.message}</span>
              )}
            </Form.Item>
          </div>

          <div className={styles.title}>
            <label className={styles.label}>Title</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Title"
                      variant="borderless"
                    />
                  )}
                />
                {errors.title && (
                  <span className={styles.error}>{errors.title.message}</span>
                )}
              </Form.Item>
            </div>
          </div>

          <div className={styles.description}>
            <label className={styles.label}>Description</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <TextArea
                      rows={3}
                      placeholder="Description"
                      variant="borderless"
                      className={styles.textarea}
                      {...field}
                    />
                  )}
                />
                {errors.description && (
                  <span className={styles.error}>
                    {errors.description.message}
                  </span>
                )}
              </Form.Item>
            </div>
          </div>

          <div className={styles.releaseYear}>
            <label className={styles.label}>Release Year</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="releaseYear"
                  control={control}
                  rules={{ required: "Release year is required" }}
                  render={({ field }) => (
                    <Input
                      min={1900}
                      max={2100}
                      {...field}
                      placeholder="Release Year"
                      variant="borderless"
                    />
                  )}
                />
                {errors.releaseYear && (
                  <span className={styles.error}>
                    {errors.releaseYear.message}
                  </span>
                )}
              </Form.Item>
            </div>
          </div>

          <div className={styles.runningTime}>
            <label className={styles.label}>Running Time (minutes)</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="runningTime"
                  control={control}
                  rules={{ required: "Running time is required" }}
                  render={({ field }) => (
                    <Input
                      min={1}
                      {...field}
                      placeholder="Running Time"
                      variant="borderless"
                    />
                  )}
                />
                {errors.runningTime && (
                  <span className={styles.error}>
                    {errors.runningTime.message}
                  </span>
                )}
              </Form.Item>
            </div>
          </div>

          <div className={styles.quality}>
            <label className={styles.label}>Quality</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="qualityIds"
                  control={control}
                  rules={{ required: "Quality is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="multiple"
                      placeholder="Select Quality"
                      variant="borderless"
                      loading={qualityQuery.status === "loading"}
                      {...field}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    >
                      {qualityQuery.status === "success" &&
                        qualityQuery.response.map((quality) => (
                          <Select.Option key={quality.id} value={quality.id}>
                            {quality.name}
                          </Select.Option>
                        ))}
                    </Select>
                  )}
                />
                {errors.qualityIds && (
                  <span className={styles.error}>
                    {errors.qualityIds.message}
                  </span>
                )}
              </Form.Item>
            </div>
          </div>

          <div className={styles.age}>
            <label className={styles.label}>Age Rating</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="age"
                  control={control}
                  rules={{ required: "Age rating is required" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Age" variant="borderless" />
                  )}
                />
              </Form.Item>
              {errors.age && (
                <span className={styles.error}>{errors.age.message}</span>
              )}
            </div>
          </div>

          <div className={styles.chooseCountries}>
            <label className={styles.label}>Country</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: "Countries are required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Country"
                      variant="borderless"
                    ></Input>
                  )}
                />
                {errors.country && (
                  <span className={styles.error}>{errors.country.message}</span>
                )}
              </Form.Item>
            </div>
          </div>

          <div className={styles.chooseGenres}>
            <label className={styles.label}>Genres</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="genreIds"
                  control={control}
                  rules={{ required: "Genres are required" }}
                  render={({ field }) => (
                    <Select
                      mode="multiple"
                      {...field}
                      placeholder="Select genres"
                      variant="borderless"
                      loading={genreQuery.status === "loading"}
                      value={field.value || []}
                      onChange={(value) => field.onChange(value)}
                    >
                      {genreQuery.status === "success" &&
                        genreQuery.response.map((genre) => (
                          <Select.Option key={genre.id} value={genre.id}>
                            {genre.name}
                          </Select.Option>
                        ))}
                    </Select>
                  )}
                />
                {errors.genreIds && (
                  <span className={styles.error}>
                    {errors.genreIds.message}
                  </span>
                )}
              </Form.Item>
            </div>
          </div>

          <div className={styles.categories}>
            <Form.Item required>
              <div className={`${styles.inlineRadio} ${styles.radioWrapper}`}>
                <p>Category</p>
                <Controller
                  name="categoryIds"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      value={field.value?.[0] || null}
                      onChange={(e) => field.onChange([e.target.value])}
                    >
                      {categoryQuery.status === "success" &&
                        categoryQuery.response.map((category) => (
                          <Radio key={category.id} value={category.id}>
                            {category.name}
                          </Radio>
                        ))}
                    </Radio.Group>
                  )}
                />
              </div>
              {errors.categoryIds && (
                <span className={styles.error}>
                  {errors.categoryIds.message}
                </span>
              )}
            </Form.Item>
          </div>

          <div className={styles.isPremiered}>
            <Form.Item>
              <div className={`${styles.inlineRadio} ${styles.radioWrapper}`}>
                <p>Is Premiered</p>
                <Controller
                  name="isPremiered"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value === true ||
                      value === false ||
                      "Please select if the movie is premiered",
                  }}
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      value={field.value ?? null}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  )}
                />
              </div>
              {errors.isPremiered && (
                <span className={styles.error}>
                  {errors.isPremiered.message}
                </span>
              )}
            </Form.Item>
          </div>

          <div className={styles.actors}>
            <label className={styles.label}>Actors</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="actorIds"
                  control={control}
                  rules={{ required: "Actors are required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="multiple"
                      placeholder="Select Actors"
                      variant="borderless"
                      loading={actorQuery.status === "loading"}
                      {...field}
                      value={field.value || []}
                      onChange={(val) => field.onChange(val)}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label as string)
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {actorQuery.status === "success" &&
                        actorQuery.response.map((actor) => (
                          <Select.Option
                            key={actor.id}
                            value={actor.id}
                            label={actor.name}
                          >
                            {actor.name}
                          </Select.Option>
                        ))}
                    </Select>
                  )}
                />
                {errors.actorIds && (
                  <span className={styles.error}>
                    {errors.actorIds.message}
                  </span>
                )}
              </Form.Item>
            </div>
          </div>

          <div className={styles.director}>
            <label className={styles.label}>Director</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="directorId"
                  control={control}
                  rules={{ required: "Director is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Director"
                      variant="borderless"
                      loading={directorQuery.status === "loading"}
                      {...field}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label as string)
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {directorQuery.status === "success" &&
                        directorQuery.response.map((director) => (
                          <Select.Option
                            key={director.id}
                            value={director.id}
                            label={director.name}
                          >
                            {director.name}
                          </Select.Option>
                        ))}
                    </Select>
                  )}
                />
                {errors.directorId && (
                  <span className={styles.error}>
                    {errors.directorId.message}
                  </span>
                )}
              </Form.Item>
            </div>
          </div>

          <div className={styles.addLink}>
            <label className={styles.label}>Link</label>
            <div className={styles.inputStyles}>
              <Form.Item required>
                <Controller
                  name="link"
                  control={control}
                  rules={{ required: "Link is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Link"
                      variant="borderless"
                    ></Input>
                  )}
                />
                {errors.link && (
                  <span className={styles.error}>{errors.link.message}</span>
                )}
              </Form.Item>
            </div>
          </div>
        </div>

        <Form.Item>
          <Button
            variant="outlined"
            htmlType="submit"
            className={styles.button}
          >
            Publish
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddMovieForm;
