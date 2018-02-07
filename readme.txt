1. 
put these files into /html
rfHOST.htm
rfHOST_DEMO.htm
scripts/user.js*

or 

add this line to your jsctempl.htm:
<script type="text/javascript" src="scripts/user.js"></script>


2. run the omnis library
REMOTEOBJECTS.lbs

3. if you or your OS overwrites rfHOST.htm use the copy in rfHOST_DEMO.htm

* user.js takes care, that any remote form with a name starting with 'ro'  (e.g. roSQUARE or roPOWER) is drifted into a remote object.
- if you place a remoteObejct into a subform control, it will be available via the container window
- if you open a remoteObejct with $openform it will be available via a js notation tree like in $root.$iremoteobjs.roSQUARE.$square(pNumber2square)

Please report any problem you might run into.

TIA, LArs
