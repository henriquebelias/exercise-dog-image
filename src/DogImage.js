import React, { Component } from 'react';
import './DogImage.css';

class DogImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dogImageUrl: '',
      loading: false,
      dogImageList: [],
      dogName: '',
    }

    this.fetchDogImage = this.fetchDogImage.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveDogName = this.saveDogName.bind(this);
  }

  fetchDogImage() {
    this.setState({
      loading: true,
    }, async () => {
      const requestResponse = await fetch('https://dog.ceo/api/breeds/image/random');
      const imagePathObject = await requestResponse.json();

      this.setState({
        dogImageUrl: imagePathObject.message,
        loading: false,
      });
    })
  }

  loadingPage() {
    return (
      <h4>Loading...</h4>
    )
  }

  handleClick() {
    if(!this.state.dogImageUrl.includes('terrier')){
      this.setState(({ dogImageUrl, dogImageList, dogName }) => ({
        dogImageList: [...dogImageList, {name: dogName, url: dogImageUrl}],
        dogName: '',
      }));
    }
    this.fetchDogImage();
  }

  handleChange({ target: { name, value } }) {
    this.setState({
      [name]: value,
    });
  }

  saveDogName() {
    const { dogName, dogImageUrl } = this.state;
    localStorage.setItem('dogNameAndImage', JSON.stringify({name: dogName, imageUrl: dogImageUrl}));
  }

  componentDidMount() {
    if(localStorage.dogNameAndImage) {
      const dogObj = JSON.parse(localStorage.dogNameAndImage);
      this.setState({
        dogName: dogObj.name,
        dogImageUrl: dogObj.imageUrl
      });
    } else {
      this.fetchDogImage();
    }
  }

  shouldComponentUpdate(_nextProps, nextState) {
    if(nextState.dogImageUrl.includes('terrier')) {
      return false;
    }
    return true;
  }


  componentDidUpdate(_prevProps, prevState) {
    if(prevState.dogImageUrl !== this.state.dogImageUrl) {
      const message = this.state.dogImageUrl.split('/breeds/');
      const dogBreed = message[1].split('/');
      alert(dogBreed[0]);
    }
  }

  render() {
    const { loading, dogImageUrl, dogImageList, dogName } = this.state;
    return (
      <div>
        {loading
          ? this.loadingPage()
          : <div
              className="container">
                <p>{dogName}</p>
                <img src={ dogImageUrl } alt="A dog" />
            </div>
        }
        <div>
          <label htmlFor="dog-name">
            Dê um nome para o cãozinho:
            <input type="text" name="dogName" value={ dogName } onChange={ this.handleChange } id="dog-name"/>
          </label>
        </div>
        <div>
          <button type="button" onClick={this.saveDogName}>Salve o cãozinho</button>
          <button type="button" onClick={ this.handleClick }>Mais um cãozinho</button>
        </div>
        <div className="listContainer">
          {dogImageList
            .map(({ name, url }) => (
              <div
                key={ url }
                className="container">
                  <p>{name}</p>
                  <img src={ url } alt="A dog"/>
              </div> ))
          }
        </div>
      </div>
    )
  }

}

export default DogImage;
