
// my-test-file.js
function check_for_nan_error() {
  // Deliberately cause a NaN value
  var result = 10 / "a";
  console.log("Result:", result); // Output will be "Result: NaN"
}
check_for_nan_error();

