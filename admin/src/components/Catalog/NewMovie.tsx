import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Form, Input, Select, Button, App, Radio } from "antd";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import styles from "./addMovieForm.module.css";

const { TextArea } = Input;
const { Option } = Select;

type FormFields = {
  title: string;
  description: string;
  releaseYear: number;
  runningTime: number;
  quality: string[];
  genres: string[];
  age: string;
  actors: string[];
  director: string;
  category: string;
  countries: string;
  photos: FileList | null;
  cover: FileList | null;
  video: File | null;
  link: string;
};
const genres = [
  { genreId: 1, name: "Adventure" },
  { genreId: 2, name: "Action" },
  { genreId: 3, name: "Romance" },
  { genreId: 4, name: "Thriller" },
  { genreId: 5, name: "Fantasy" },
  { genreId: 6, name: "Mystery" },
  { genreId: 7, name: "Sci-Fi" },
];

const categories = [
  { categoryId: 1, name: "Movie" },
  { categoryId: 2, name: "TV Series" },
  { categoryId: 3, name: "Cartoon" },
];

const AddMovieForm: React.FC = () => {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const { message } = App.useApp();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log("Form Data:", data as FormFields);
    message.success("Movie added successfully!");
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

          <div className={`${styles.title} ${styles.inputStyles}`}>
            <Form.Item required>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Title" variant="borderless" />
                )}
              />
              {errors.title && (
                <span className={styles.error}>{errors.title.message}</span>
              )}
            </Form.Item>
          </div>

          <div className={`${styles.description} ${styles.inputStyles}`}>
            <Form.Item required>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <TextArea
                    rows={4}
                    placeholder="Description"
                    variant="borderless"
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

          <div className={`${styles.releaseYear} ${styles.inputStyles}`}>
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

          <div className={`${styles.runningTime} ${styles.inputStyles}`}>
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

          <div className={`${styles.quality} ${styles.inputStyles}`}>
            <Form.Item required>
              <Controller
                name="quality"
                control={control}
                rules={{ required: "Quality is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    placeholder="Quality"
                    variant="borderless"
                  >
                    <Option value="1080p">1080p</Option>
                    <Option value="720p">720p</Option>
                    <Option value="480p">480p</Option>
                  </Select>
                )}
              />
              {errors.quality && (
                <span className={styles.error}>{errors.quality.message}</span>
              )}
            </Form.Item>
          </div>

          <div className={`${styles.age} ${styles.inputStyles}`}>
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

          <div className={`${styles.chooseCountries} ${styles.inputStyles}`}>
            <Form.Item required>
              <Controller
                name="countries"
                control={control}
                rules={{ required: "Countries are required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Countries"
                    variant="borderless"
                  >
                    <Option value="USA">USA</Option>
                    <Option value="UK">UK</Option>
                    <Option value="France">France</Option>
                    <Option value="India">India</Option>
                  </Select>
                )}
              />
              {errors.countries && (
                <span className={styles.error}>{errors.countries.message}</span>
              )}
            </Form.Item>
          </div>

          <div className={`${styles.chooseGenres} ${styles.inputStyles}`}>
            <Form.Item required>
              <Controller
                name="genres"
                control={control}
                rules={{ required: "Genres are required" }}
                render={({ field }) => (
                  <Select
                    mode="multiple"
                    {...field}
                    placeholder="Select genres"
                    variant="borderless"
                  >
                    {genres.map((genre) => (
                      <Option
                        key={genre.genreId}
                        value={genre.genreId}
                        label={genre.name}
                      >
                        {genre.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.genres && (
                <span className={styles.error}>{errors.genres.message}</span>
              )}
            </Form.Item>
          </div>

          <div className={`${styles.uploadPhotos} ${styles.inputStyles}`}>
            <Form.Item>
              <Controller
                name="photos"
                control={control}
                render={({ field }) => (
                  <label className={styles.uploadLabel}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      multiple
                      onChange={(e) => field.onChange(e.target.files)}
                      className={styles.hiddenInput}
                    />
                    <span>Upload Photos</span>
                    <UploadOutlined className={styles.uploadIcon} />
                  </label>
                )}
              />
            </Form.Item>
          </div>

          <div className={styles.categories}>
            <Form.Item required>
              <div className={`${styles.inlineRadio} ${styles.radioWrapper}`}>
                <p>Category</p>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Radio.Group {...field}>
                      {categories.map((category) => (
                        <Radio
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.name}
                        </Radio>
                      ))}
                    </Radio.Group>
                  )}
                />
              </div>
              {errors.category && (
                <span className={styles.error}>{errors.category.message}</span>
              )}
            </Form.Item>
          </div>

          <div className={`${styles.actors} ${styles.inputStyles}`}>
            <Form.Item required>
              <Controller
                name="actors"
                control={control}
                rules={{ required: "Actors are required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Actors (comma separated)"
                    variant="borderless"
                  />
                )}
              />
              {errors.actors && (
                <span className={styles.error}>{errors.actors.message}</span>
              )}
            </Form.Item>
          </div>

          <div className={`${styles.director} ${styles.inputStyles}`}>
            <Form.Item required>
              <Controller
                name="director"
                control={control}
                rules={{ required: "Director is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Director"
                    variant="borderless"
                  />
                )}
              />
              {errors.director && (
                <span className={styles.error}>{errors.director.message}</span>
              )}
            </Form.Item>
          </div>

          <div className={`${styles.uploadVideos} ${styles.inputStyles}`}>
            <Form.Item>
              <Controller
                name="video"
                control={control}
                render={({ field }) => (
                  <label className={styles.uploadLabel}>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      accept="video/*"
                      onChange={(e) => field.onChange(e.target.files)}
                      className={styles.hiddenInput}
                    />
                    <span>Upload Video</span>
                    <UploadOutlined className={styles.uploadIcon} />
                  </label>
                )}
              />
            </Form.Item>
          </div>

          <div className={`${styles.addLink} ${styles.inputStyles}`}>
            <Form.Item>
              <Controller
                name="link"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Link" variant="borderless" {...field} />
                )}
              />
            </Form.Item>
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
