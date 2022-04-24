let styles = document.createElement('style');

styles.textContent = `
@import url(https://fonts.googleapis.com/css?family=Exo+2:400,700,500,300);

body {
  background: #ebeff2;
  font-family: "Exo 2";
}

.zone {      
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: radial-gradient(ellipse at center,#EB6A5A 0,#c9402f 100%);
  width:80%;
  height:50%;  
  border:5px dashed white;
  text-align:center;
  color: white;
  z-index: 20;
  transition: all 0.3s ease-out;
  box-shadow: 0 0 0 1px rgba(255,255,255,.05),inset 0 0 .25em 0 rgba(0,0,0,.25);
  .btnCompression {
    .btn {

    } 
    .active {
      background: #EB6A5A;
      color:white;
    }
  }
  i {
    text-align: center;
    font-size: 10em;  
    color:#fff;
    margin-top: 50px;
  }
  .selectFile {
    height: 50px;
    margin: 20px auto;
    position: relative;
    width: 200px;          
  }

  label, input {
    cursor: pointer;
    display: block;
    height: 50px;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    border-radius: 5px;          
  }

  label {
    background: #fff;
    color:#EB6A5A;
    display: inline-block;
    font-size: 1.2em;
    line-height: 50px;
    padding: 0;
    text-align: center;
    white-space: nowrap;
    text-transform: uppercase;
    font-weight: 400;   
    box-shadow: 0 1px 1px gray;
  }

  input[type=file] {
    opacity: 0;
  }

}
.zone.in {
  color:white;
  border-color:white;
  background: radial-gradient(ellipse at center,#EB6A5A 0,#c9402f 100%);
  i {          
    color:#fff;
  }
  label {
    background: #fff;
    color:#EB6A5A;
  }
}
.zone.hover {
  color:gray;
  border-color:white;
  background:#fff;
  border:5px dashed gray;
  i {          
    color:#EB6A5A;
  }
  label {
    background: #fff;
    color:#EB6A5A;
  }
}
.zone.fade {
  transition: all 0.3s ease-out;
  opacity: 1;
}
`;

export default styles;