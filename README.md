##Alzheimer's Patient Call Manager

####Project Summary
A very simple application that allows Alzheimer's Patients Phone calls to be monitored using ALU's Phone Management API's.

#####Getting it working
1.	Deploy this code on Parse, update project keys to match account
1.	Create an account with AT&T Foundry
1.	Set up call management API's to report call event info to the callEvent endpoint.
1.	Enjoy working demo.

#####What works

- Phone numbers entered into the phone book class can be blocked on the fly.
- Phone calls received by phone numbers registered with endpoint will be checked against the whitepages phone reputation API. A score higher than 2 will result in the call being blocked
- Incoming phone calls are logged through the web interface, along with wether they were blocked or not