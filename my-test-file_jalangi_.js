J$.iids = {"9":[5,16,5,18],"10":[5,16,5,24],"17":[5,21,5,24],"25":[5,16,5,24],"33":[5,16,5,24],"41":[6,3,6,10],"49":[6,15,6,24],"57":[6,26,6,32],"65":[6,3,6,33],"67":[6,3,6,14],"73":[6,3,6,34],"81":[3,1,7,2],"89":[3,1,7,2],"97":[3,1,7,2],"105":[8,1,8,20],"113":[8,1,8,22],"121":[8,1,8,23],"129":[1,1,10,1],"137":[3,1,7,2],"145":[1,1,10,1],"153":[3,1,7,2],"161":[3,1,7,2],"169":[1,1,10,1],"177":[1,1,10,1],"nBranches":0,"originalCodeFileName":"/workspaces/nodebb-fall-2025-committed-gang/my-test-file.js","instrumentedCodeFileName":"/workspaces/nodebb-fall-2025-committed-gang/my-test-file_jalangi_.js","code":"\n// my-test-file.js\nfunction check_for_nan_error() {\n  // Deliberately cause a NaN value\n  var result = 10 / \"a\";\n  console.log(\"Result:\", result); // Output will be \"Result: NaN\"\n}\ncheck_for_nan_error();\n\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(129, '/workspaces/nodebb-fall-2025-committed-gang/my-test-file_jalangi_.js', '/workspaces/nodebb-fall-2025-committed-gang/my-test-file.js');
            function check_for_nan_error() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(81, arguments.callee, this, arguments);
                            arguments = J$.N(89, 'arguments', arguments, 4);
                            J$.N(97, 'result', result, 0);
                            var result = J$.X1(33, J$.W(25, 'result', J$.B(10, '/', J$.T(9, 10, 22, false), J$.T(17, "a", 21, false), 0), result, 1));
                            J$.X1(73, J$.M(65, J$.R(41, 'console', console, 2), 'log', 0)(J$.T(49, "Result:", 21, false), J$.R(57, 'result', result, 0)));
                        } catch (J$e) {
                            J$.Ex(153, J$e);
                        } finally {
                            if (J$.Fr(161))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            check_for_nan_error = J$.N(145, 'check_for_nan_error', J$.T(137, check_for_nan_error, 12, false, 81), 0);
            J$.X1(121, J$.F(113, J$.R(105, 'check_for_nan_error', check_for_nan_error, 1), 0)());
        } catch (J$e) {
            J$.Ex(169, J$e);
        } finally {
            if (J$.Sr(177)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
