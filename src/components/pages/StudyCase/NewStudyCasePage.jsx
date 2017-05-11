import React from 'react';
import { Select, Input, Form, Button, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Link } from 'react-router';
import { Autobind } from 'es-decorators';
import { validation } from 'utils/validation';
import { createStudyCase } from 'modules/study-cases';
import { getCategories } from 'modules/categories';
import { dispatch } from 'main';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { push } from 'react-router-redux';
import Creator from 'components/creator/Creator';
import DropZone from 'components/dropzone/DropZone';
import PropTypes from 'prop-types';
import CitySearch from 'components/cities/CitySearch';

/* Utils */
function toBase64(file, cb) {
  const reader = new FileReader();
  reader.onload = (event) => {
    cb && cb(event.target.result);
  };
  reader.readAsDataURL(file);
}

class NewStudyCasePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      category_id: null,
      city_ids: [],
      comments: [],
      photos_attributes: [],
      documents_attributes: []
    };
    this.form = {
      project_type: 'StudyCase'
    };
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.categories.solution.length || dispatch(getCategories({ type: 'solution' }));
  }

  /* Event handlers */
  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    const { city_ids, photos_attributes, documents_attributes, category_id } = this.state;

    dispatch(createStudyCase({
      data: {
        ...this.form,
        category_id,
        photos_attributes,
        documents_attributes,
        city_ids: city_ids.map(c => c.value)
      },
      onSuccess() {
        dispatch(push('/study-cases'));
        toastr.success('Study case created!');
      }
    }));
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onBmeAdd(comment) {
    const comments = this.state.comments.slice();
    comments.push(comment);
    this.setState({ comments });
  }

  @Autobind
  onImageDrop(acceptedImgs, rejectedImgs) {
    const parsedPhotos = [];

    rejectedImgs.forEach(file => toastr.error(`The image "${file.name}" hast not a valid extension`));

    acceptedImgs.forEach((file, i) => {
      toBase64(file, (parsedFile) => {
        parsedPhotos.push({
          name: file.name,
          is_active: true,
          attachment: parsedFile
        });

        if (i === (acceptedImgs.length - 1)) {
          let photos_attributes = this.state.photos_attributes.slice();
          photos_attributes = [...photos_attributes, ...parsedPhotos];
          this.setState({ photos_attributes });
        }
      });
    });
  }

  @Autobind
  onFileDrop(acceptedFiles, rejectedFiles) {
    const parsedFiles = [];

    rejectedFiles.forEach(file => toastr.error(`The file "${file.name}" has not a valid extension`));

    acceptedFiles.forEach((file, i) => {
      toBase64(file, (parsedFile) => {
        parsedFiles.push({
          name: file.name,
          is_active: true,
          attachment: parsedFile
        });

        if (i === (acceptedFiles.length - 1)) {
          let documents_attributes = this.state.documents_attributes.slice();
          documents_attributes = [...documents_attributes, ...parsedFiles];
          this.setState({ documents_attributes });
        }
      });
    });
  }

  @Autobind
  onDeleteImage(index) {
    const photos_attributes = this.state.photos_attributes.slice();
    window.URL.revokeObjectURL(photos_attributes[index].attachment);
    photos_attributes.splice(index, 1);
    this.setState({ photos_attributes });
  }

  @Autobind
  onDeleteFile(index) {
    const documents_attributes = this.state.documents_attributes.slice();
    window.URL.revokeObjectURL(documents_attributes[index].attachment);
    documents_attributes.splice(index, 1);
    this.setState({ documents_attributes });
  }

  /* Render */
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        {/* Submit buttons */}
        <BtnGroup>
          <Button className="button success" type="submit">Save</Button>
          <Link className="button alert" to="/study-cases">Cancel</Link>
        </BtnGroup>
        {/* Name */}
        <Input type="text" value="" name="name" onChange={this.onInputChange} label="Study case title" validations={['required']} />
        <Select
          name="category_id"
          label="Category"
          validations={['required']}
          value={this.state.category_id}
          onChange={item => this.setState({ category_id: item.value })}
          options={this.props.categories.solution.map(cat => ({ value: cat.id, label: cat.name }))}
        />
        <CitySearch
          multi
          name="city_ids"
          label="Cities"
          validations={['required']}
          value={this.state.city_ids}
          onChange={items => this.setState({ city_ids: items })}
        />
        <Textarea validations={[]} onChange={this.onInputChange} label="Solution" name="solution" />
        <Textarea validations={[]} onChange={this.onInputChange} label="Situation" name="situation" />
        <Creator title="BMEs" items={this.state.comments} onAdd={this.onBmeAdd} />
        <div className="row expanded">
          <div className="column small-6">
            <DropZone
              title="Images"
              accept={'image/png, image/jpg, image/jpeg'}
              files={this.state.photos_attributes}
              onDrop={this.onImageDrop}
              onDelete={this.onDeleteImage}
              withImage
            />
          </div>
          <div className="column small-6">
            <DropZone
              title="Files"
              files={this.state.documents_attributes}
              accept={'application/pdf, application/json, application/msword, application/excel'}
              onDrop={this.onFileDrop}
              onDelete={this.onDeleteFile}
            />
          </div>
        </div>
      </Form>
    );
  }
}

// Map state to props
const mapStateToProps = ({ categories }) => ({
  categories: {
    solution: categories.solution
  }
});

// NewStudyCasePage.propTypes = {
//   categories: PropTypes.array
// };

export default connect(mapStateToProps, null)(NewStudyCasePage);
