function checkEmptyFields (user) {
  const userProperties = Object.keys(user)
  const requiredFields = {emptyFields: false}
  userProperties.forEach(property => {
    if (user[property] === undefined) {
      requiredFields[property] = true
      emptyFields = true
    }
    else requiredFields[property] = false
  })
  return requiredFields
}

module.exports = checkEmptyFields