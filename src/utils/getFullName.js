function getFullName(data) {
  let { firstName, lastName, ...rest } = data;

  return {
    ...rest,
    fullName: `${firstName} ${lastName}`,
  };
}

module.exports = { getFullName }