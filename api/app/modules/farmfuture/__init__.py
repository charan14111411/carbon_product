"""Varsapradaya's FarmFuture platform (https://api.farmfuture.io/api), ported from the first integration.

Used for one question at registration -- is this phone number an existing Varsapradaya customer? -- and,
if so, to import their farm records and register their SoilSync / MicroClime devices. Carbon never
comes from here: the platform supplies supporting data only, and the latest value at that.

* ``client.py``    the four HTTP calls (read-only)
* ``parsing.py``   tolerant field picking and the -1 "no reading" sentinel
* ``lookup.py``    customer lookup and the device tier (full / partial / none)
* ``directory.py`` ``FarmFutureDirectory`` for ``VC_MEMBER_DIRECTORY=farmfuture``
* ``devices.py``   ``FarmFutureDeviceProvider`` for ``VC_DEVICE_PROVIDER=farmfuture``
* ``trace.py``     one masked log line per call
"""
