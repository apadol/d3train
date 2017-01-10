# d3train

To run project on your local machine install node.js LTS and run `npm run serve`

Status fields:

1. idle
2. progress
3. pause
4. blocked
5. OK
6. fail

Node ID's:

1. code
2. fr
3. frraport
4. tag
5. package
6. demo
7. demosanitycore
8. demosanitypl
9. demosanityprog
10. demosanitylti
11. demosanityltinse
12. demogonogo
13. staging
14. stagingsanitycore
15. stagingsanitypl
16. stagingsanityprog
17. stagingsanitylti
18. stagingsanityltinse
19. staginggonogo
20. res
21. alm
22. gonogo

# API

## Status Update 

`POST /status`

### Body example

`{
"version":"version",
"nodes":[
    {
        "id":"demo",
    	"status":"fail"
    },
    {
    	"id": "package",
    	"status":"progress"
    },
    {
    	"id": "code",
    	"status": "pause"
    },
    {
    	"id": "fr",
    	"status": "blocked"
    }
]
}

## New release

`POST /release`

Request resets state and assigns new version

### Body example

`{
"version":"7.15.16"
}`

