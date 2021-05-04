class Subareas {
  static subareas = {};

  static limpiar = () => {
    console.log("Se limpió Subareas");
    Subareas.subareas = {};
  }

  static find = (subarea_id) => {
    for (const area of Object.keys(this.subareas)) {
      for (const subarea of this.subareas[area]){
        if (subarea.id === subarea_id) {return subarea;}
      }
    }
    return null;
  }
}

export default Subareas;