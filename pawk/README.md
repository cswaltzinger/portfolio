# Pawk Utility

`pawk` is a python interpretation of the standard unix tool `awk`.  It essentially behaves in the same manner as `awk` and reads each line in stdin while evaluating a given python script on the line of input.  

---

## Example Usage 
(assuming `pawk` is in $PATH)

### list all cached hosts that resolve to the loopback address
```bash
$ cat /etc/hosts | pawk --printif 'vals[0] == "127.0.0.1"'
127.0.0.1       csw.server
127.0.0.1           localhost
```
### list the last 10 daemon users and their login shell
```bash
$  cat /etc/passwd | pawk '
values = _line.split(":")
print(values[-1],values[0],sep="\t")
' | tail -n 10
/usr/bin/false  _aonsensed
/usr/bin/false  _modelmanagerd
/usr/bin/false  _reportsystemmemory
/usr/bin/false  _swtransparencyd
/usr/bin/false  _naturallanguaged
/usr/bin/false  _spinandd
/usr/bin/false  _corespeechd
/usr/bin/false  _diagnosticservicesd
/usr/bin/false  _mds_stores
/usr/bin/false  _oahd

```
