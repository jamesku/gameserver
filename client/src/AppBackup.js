import React, {
  Component
} from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import {
  Input,
  Button
} from 'semantic-ui-react';
import io from 'socket.io-client';
const socket = io('http://192.168.1.16');


class App extends Component {

  state = {
    response: '',
    name: '',
    playerassigned: 0,
    correct:false,
    playercolor:'black',
    ready:false
  };

  // componentDidMount() {
  //   this.callApi()
  //     .then(res => this.setState({
  //       response: res.express
  //     }))
  //     .catch(err => console.log(err));
  // }
  //
  // callApi = async () => {
  //   const response = await fetch('/api/hello');
  //   const body = await response.json();
  //
  //   if (response.status !== 200) throw Error(body.message);
  //
  //   return body;
  // }

  submitName = async () => {
      const response = await fetch('/api/postname', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.name,
        }),
      });
      const json = await response.json();
      this.setState({playerassigned: json.playerassigned,
                      playercolor: json.playercolor});
      console.log(this.state.playerassigned);
    }

      setName(value) {
        this.setState({name: value});
        console.log(this.state.name);
      };

      inputBar(){
        if (this.state.playerassigned > 0){
          return(
            <div style = {{flexGrow: 1, flexShrink: 1, fontSize: '300%', flexDirection: 'column', display: 'flex', alignItems: 'center', color:'white'}}>
            {this.state.name}
            </div>
          )
          } else{

            return(
              <div style = {{flexGrow: 1, flexShrink: 1, flexDirection: 'column', display: 'flex', alignItems: 'center', color:'white'}}>
              <b>WELCOME TO THE THUNDERDOOOOOOM-UH, Lets get to it</b>
              <br />
              <Input placeholder = 'Enter Name Here'
              action = { <Button color = 'teal'
                onClick = {
                  () => this.submitName()
                }>Go< /Button>}
                onChange = {
                  e => {
                    this.setName(e.target.value)
                  }
                }
                />
                </div>
            )
          }
        }


        signalReadytoAPI = async () => {
            const response = await fetch('/api/ready', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: this.state.name,
                ready: true
              }),
            });
            const json = await response.json();
            this.setState({ready: true});
          }


        signalReady(){
          if (!this.state.ready && !(this.state.playercolor==='black')){
            return(
              <div>
              <br />
              <Button color = 'white'
                fluid='true'
                onClick = {
                  () => this.signalReadytoAPI()
                }>Ready to Play< /Button>
              </div>
            )
        }
      }

        submitValue(value){

        }

        pickAnswers(){
          if (this.state.playerassigned > 0){
            return(
              <div>
              <br />
              <Button color = 'red'
                fluid='true'
                onClick = {
                  () => this.submitValue("a")
                }>A< /Button>
                <br />
                <Button color = 'blue'
                fluid='true'
                  onClick = {
                    () => this.submitValue("b")
                  }>B< /Button>
                  <br />
                  <Button color = 'yellow'
                  fluid='true'
                    onClick = {
                      () => this.submitValue("c")
                    }>C< /Button>
                    <br />
                    <Button color = 'green'
                    fluid='true'
                      onClick = {
                        () => this.submitValue("c")
                      }>D< /Button>
                      <br />
              </div>
            )
            }
          }


      render() {
        return (
          <div style = {styles.container} >
            < div style = {{backgroundColor:this.state.playercolor, display: 'flex',
            alignItems: 'center',
            fontSize:'100%',
            flexDirection: 'column',
            font:'white',
            minHeight:'20%',
            paddingBottom: '10%',
            paddingTop: '10%'}}  >
              {this.inputBar()}
              </div>
              {this.pickAnswers()}
              {this.signalReady()}

            </div>
          );
        }
      }

      export default App;

      var styles = {
        container:
        {
        display: 'flex',
        flexDirection: 'column',
        width:'100%',
        height:'100%',

      },
      headerStyle:{
        display: 'flex',
        alignItems: 'center',
        fontSize:'100%',
        font:'white',
        minHeight:'20%'
      }
      };
