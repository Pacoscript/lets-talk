const registerConfig = {
  formFields: [
    {
      label: 'Name',
      type: 'input',
      maxLength: '16',
      name: 'name'
    },
    {
      label: 'Surname',
      type: 'input',
      maxLength: '16',
      name: 'surname'
    },
    {
      label: 'Username',
      type: 'input',
      maxLength: '16',
      name: 'username'
    },
    {
      label: 'Password',
      type: 'input',
      maxLength: '16',
      name: 'password'
    },
    {
      label: 'Sex',
      type: 'select',
      defaultValue: '',
      name: 'sex',
      options: ['CHOOSE YOUR SEX', 'MALE', 'FEMALE']
    },
    {
      label: 'Age',
      type: 'input',
      maxLength: '16',
      name: 'age'
    },
    {
      label: 'City',
      type: 'select',
      defaultValue: '',
      name: 'city',
      options: [
        'Choose your city',
        'A Coruña',
        'Álava',
        'Albacete',
        'Alicante',
        'Almería',
        'Asturias',
        'Ávila',
        'Badajoz',
        'Barcelona',
        'Burgos',
        'Cáceres',
        'Cádiz',
        'Cantabria',
        'Castellón',
        'Ceuta',
        'Ciudad Real',
        'Córdoba',
        'Cuenca',
        'Gerona',
        'Girona',
        'Las Palmas',
        'Granada',
        'Guadalajara',
        'Guipúzcoa',
        'Huelva',
        'Huesca',
        'Jaén',
        'La Rioja',
        'León',
        'Lleida',
        'Lugo',
        'Madrid',
        'Malaga',
        'Mallorca',
        'Melilla',
        'Murcia',
        'Navarra',
        'Orense',
        'Palencia',
        'Pontevedra',
        'Salamanca',
        'Segovia',
        'Sevilla',
        'Soria',
        'Tarragona',
        'Tenerife',
        'Teruel',
        'Toledo',
        'Valencia',
        'Valladolid',
        'Zamora',
        'Zaragoza',
      ]
    },
    {
      label: 'Presentation',
      type: 'textarea',
      maxLength: '280',
      name: 'presentation'
    },
    {
      label: 'Min Age',
      type: 'input',
      maxLength: '16',
      name: 'minAgePref'
    },
    {
      label: 'Max Age',
      type: 'input',
      maxLength: '16',
      name: 'maxAgePref'
    }
  ]
}


export default registerConfig
