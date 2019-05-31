import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import InputAdornment from '@material-ui/core/InputAdornment';
import NumberFormat from 'react-number-format';

import AWS from 'aws-sdk';
import { withCookies, Cookies } from 'react-cookie';
import compose from 'recompose/compose';
import { Skeleton } from 'antd';

import CategoryCard from '../category-card/component';
import * as EndPoints from '../../utils/end-points';
import * as Resources from '../../utils/resources';

import './style.css';

var suggestions = [];
var uploadInfo;

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const styles = theme => ({
  root: {
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  input: {
    marginTop: '20px'
  }
});

class CreateCampaign extends Component {
  popperNode = null;

  constructor(props) {
    super(props);

    if(this.props.location && this.props.location.state && this.props.location.state.referrer) {
      this.setState({displaySkeleton: true});
      this.state = this.props.location.state.referrer;
      this.getUploadInfo();
    } else {
      this.state = {
        activeStep: 0,
        skipped: new Set(),
        single: '',
        popper: '',
        suggestions: [],
        isNextPressed: false,
        categories: [],
        category: '',
        title: '',
        description: '',
        amount: '',
        expensesDescription: '',
        startDate: '',
        endDate: '',
        location: '',
        image: '',
        images: [],
        displaySkeleton: false
      };
    }
  }

  componentWillMount() {
    let url = EndPoints.getCategoriesUrl;
    let appToken = localStorage.getItem('appToken');
    let config = {
      headers: {'Authorization': "Bearer " + appToken}
    };
    var that = this;
    axios.get(url, config)
    .then(response => {
      that.setState({
        categories: response.data.content
      });
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  isStepOptional = step => {
    return 0;
    // return step === 1;
  };

  handleNext = () => {
    const { activeStep } = this.state;
    let { skipped } = this.state;

    this.setState({isNextPressed: true});

    switch (activeStep) {
      case 1:
        if (this.state.title === '' || this.state.description === '') {
          return;
        }
        break;
      case 2:
        if (this.state.amount === '' || this.state.expensesDescription === '') {
          return;
        }
        break;
      case 3:
        if (this.state.startDate === '' || this.state.endDate === '' || this.state.location === '') {
          return
        }
        break;
      case 4:
        this.finishCampaign();
        return;
      default: break;
    }

  this.setState({
      activeStep: activeStep + 1,
      isNextPressed: false,
      skipped,
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  handleSkip = () => {
    const { activeStep } = this.state;
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped,
      };
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    if (this.state.location.length > 3) {
      let url = EndPoints.getLocationUrl + this.state.location + '&key=' + Resources.googleApiKey;
      let that = this;

      axios.get(url)
      .then(function(response) {
        response.data.predictions.forEach(element => {
          suggestions.push({label: element.description})
        });

        that.setState({
          suggestions: getSuggestions(value),
        });
      })
      .catch(function(error) {
        console.log(error);
      });
    } 
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  setCategory(category) {
    this.setState({
      activeStep: 1,
      category: category
    });
  };

  handleLocationChange = name => (event, { newValue }) => {
    this.setState({
      location: newValue,
    });
  };

  onChange(e) {
    this.setState({images:Array.from(e.target.files)});
  }

  getUploadInfo() {
    let url = EndPoints.getUploadInfoUrl;
    const { cookies } = this.props;
    let appToken = cookies.get('accessToken');
    let config = {
      headers: {'Authorization': "Bearer " + appToken}
    };

    axios.get(url, config)
      .then(response => {
        uploadInfo = response.data;
        this.completeSteps();
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  finishCampaign() {
    const { cookies } = this.props;
    if(cookies.get('accessToken')) {
      this.getUploadInfo();
    } else {
      this.props.history.push({
        pathname: '/onboarding/',
        state: { referrer: this.state }
      })
    }
  }

  completeSteps() {
    AWS.config.update({region: uploadInfo.bucket_region});
    AWS.config.credentials = new AWS.Credentials({
      accessKeyId: uploadInfo.access_key_id,
      secretAccessKey: uploadInfo.access_key_secret,
      region:  uploadInfo.bucket_region
    });

    const S3 = new AWS.S3({ params: { Bucket: uploadInfo.bucket_name } });

    var imageCount = this.state.images.length;
    var uploadedImages = [];
    let that = this;

    if (!imageCount) {
      this.postCampaign();
      return;
    }

    for (var counter = 0; counter < imageCount; counter++) {
      const params = {
        Key: this.state.images[counter].name,
        ContentType: this.state.images[counter].type,
        Body: this.state.images[counter],
        ACL: 'public-read'
      };

      S3.upload(params, (err, data) => {
        if (err) {
          console.log('error S3', err);
          return alert(err);
        }

        let imageData = {  
          "format": 'image/' + data.Key.split('.')[1],
          "name": data.Key,
          "url": data.Location,
          "type":"image"
        }

        uploadedImages.push(imageData);

        if (uploadedImages.length === imageCount) {
          that.postCampaign(uploadedImages);
        }
      });
    }

  }

  postCampaign(imageData) {
    const { cookies } = this.props;
    let url = EndPoints.postCampainsUrl;
    let appToken = cookies.get('accessToken');
    let config = {
      headers: {'Authorization': "Bearer " + appToken}
    };
    let defaultImage = { 
      "format":"jpeg",
      "name":"CF8E3EB7-37F1-40A9-8BBD-DD6CEB4E98A4.jpeg",
      "url":"https://s3.eu-central-1.amazonaws.com/gohelpfund-resources/categories/charity.png",
      "type":"image"
    };
    let campaignData = {  
      "category": this.state.category,
      "start_date": new Date(this.state.startDate).toISOString().split('.')[0]+"Z",
      "end_date":"2018-09-08T12:57:00Z",
      "title": this.state.title,
      "amount_goal": parseInt(this.state.amount),
      "amount_raised": 0,
      "description": this.state.description,
      "expenses_description": this.state.description,
      "location": this.state.location,
      "media_resources": imageData ? imageData : [defaultImage],
      "backers":0
    };
    let that = this;

    this.setState({displaySkeleton: true});

    axios.post(url, campaignData, config)
      .then(response => {
        this.setState({displaySkeleton: false});
        that.props.history.push({
          pathname: '/campaign-details/' + response.data.id,
          state: { referrer: response.data }
        })
      })
      .catch(function(error) {
        this.setState({displaySkeleton: false});
        console.log(error);
      });

  }

  getSteps() {
    return ['Category', 'Description', 'Expenses', 'Timeline', 'Gallery'];
  }

  render() {
    const { classes } = this.props;
    const steps = this.getSteps();
    const { activeStep } = this.state;
    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

    const categoryList = this.state.categories.map(category => 
      <Grid item xs={6} sm={6} md={4} key={category.id} onClick={this.setCategory.bind(this, category)}>
        <CategoryCard category={category.name} imgUrl={category.image_url} />
      </Grid>
    );

    const imagesNames = this.state.images && this.state.images.length ? this.state.images.map(image => 
      <div className="file-name" key={image.lastModified}>{image.name}</div>
    ) : '';

    const displaySkeleton = this.state.displaySkeleton ? <div className="spinner-container">
                                                          <Skeleton/>
                                                          <Skeleton/>
                                                          <Skeleton/>
                                                        </div> : '';

    return (
      <div id="app-create-campaign" className={classes.root}>
        <div className="section">
          <div className="stepper">
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&quot;re finished
                </Typography>
                <Button onClick={this.handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
              <div>
                <div className="stepper-content">

                  {activeStep === 0 && 
                    <div className="step-0">
                    <h1 className="step-title">Category</h1>
                    <h2 className="step-subtitle">Choose the category that best fits your campaign</h2>
                    <div className="step-content">
                      <Grid container spacing={24}>
                        {categoryList}
                      </Grid>
                    </div>
                  </div>}

                 {activeStep === 1 && 
                  <div className="step-1">
                    <h1 className="step-title">Description</h1>
                    <h2 className="step-subtitle">What problem do you have?</h2>
                    <div className="step-content">
                      <TextField
                        id="title"
                        label="Title"
                        value={this.state.title}
                        error={this.state.title === '' && this.state.isNextPressed}
                        onChange={this.handleChange('title')}
                        margin="normal"
                        className="step-input title-input"
                      />
                      <TextField
                        id="description"
                        label="Description"
                        value={this.state.description}
                        error={this.state.description === '' && this.state.isNextPressed}
                        onChange={this.handleChange('description')}
                        multiline
                        rowsMax="4"
                        margin="normal"
                        className="step-input"
                      />
                    </div>
                  </div>}

                  {activeStep === 2 && 
                    <div className="step-2">
                    <h1 className="step-title">Expenses</h1>
                    <h2 className="step-subtitle">How much money do you need and how will you use it?</h2>
                    <div className="step-content">
                      {/* <InputLabel htmlFor="amount">Amount</InputLabel> */}
                      <TextField
                          id="amount"
                          label="Amount needed"
                          value={this.state.amount}
                          onChange={this.handleChange('amount')}
                          error={this.state.amount === '' && this.state.isNextPressed}
                          margin="normal"
                          className="step-input amount-input"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">HELP</InputAdornment>,
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                        <TextField
                          id="expensesDescription"
                          label="Expenses description"
                          value={this.state.expensesDescription}
                          onChange={this.handleChange('expensesDescription')}
                          error={this.state.expensesDescription === '' && this.state.isNextPressed}
                          multiline
                          rowsMax="4"
                          margin="normal"
                          className="step-input"
                        />
                    </div>
                  </div>}

                  {activeStep === 3 && 
                    <div className="step-3">
                    <h1 className="step-title">Date and location</h1>
                    <h2 className="step-subtitle">When and where?</h2>
                    <div className="step-content">
                    <TextField
                        id="startDate"
                        label="Start date"
                        value={this.state.startDate}
                        onChange={this.handleChange('startDate')}
                        error={this.state.startDate === '' && this.state.isNextPressed}
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="endDate"
                        label="End date"
                        value={this.state.endDate}
                        onChange={this.handleChange('endDate')}
                        error={this.state.endDate === '' && this.state.isNextPressed}
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <Autosuggest
                        {...autosuggestProps}
                        inputProps={{
                          classes,
                          label: 'Location',
                          placeholder: 'Location',
                          value: this.state.location,
                          error: this.state.location === '' && this.state.isNextPressed,
                          onChange: this.handleLocationChange('location'),
                          inputRef: node => {
                            this.popperNode = node;
                          },
                          InputLabelProps: {
                            shrink: true,
                          },
                        }}
                        theme={{
                          suggestionsList: classes.suggestionsList,
                          suggestion: classes.suggestion,
                        }}
                        renderSuggestionsContainer={options => (
                          <Popper anchorEl={this.popperNode} open={Boolean(options.children)}>
                            <Paper
                              square
                              {...options.containerProps}
                              style={{ width: this.popperNode ? this.popperNode.clientWidth : null }}
                            >
                              {options.children}
                            </Paper>
                          </Popper>
                        )}
                      />
                    </div>
                  </div>}

                  {activeStep === 4 && 
                    <div className="step-4">
                    <h1 className="step-title">Media gallery</h1>
                    <h2 className="step-subtitle">Upload images that could give a better understanding of the cause</h2>
                    <div className="step-content">
                      <div className="browse-container">
                        <input className="browse-btn" multiple id="file" type="file" accept='image/png' onChange={(e) => this.onChange(e)}/>
                        <label for="file">Choose files</label>
                      </div>
                      {imagesNames}
                    </div>
                  </div>}

                </div>
                {activeStep !== 0 &&
                  <div className="stepper-actions">
                    <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>Back</Button>
                    <Button variant="contained" color="primary" onClick={this.handleNext.bind(this)} className="next-button">
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                }
              </div>
            )}
          </div>
         {displaySkeleton}
        </div>
      </div>
    );
  }
}

CreateCampaign.propTypes = {
  classes: PropTypes.object,
};

export default compose(
  withStyles(styles),
  withCookies
)(CreateCampaign);