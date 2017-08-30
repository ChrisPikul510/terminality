# terminality 
Yet Another JS Terminal Simulator/Emulator

[View the Live Demo](https://chrispikul510.github.io/terminality/)

## What is this?
Just a little toy program I wrote in Babel ES6 React to simulate a terminal/bash/commandline. It is not an _emulation_ of bash or any other 
flavours exactly. It's fairly loose and not full featured. The main things I wanted to handle was prompt input, tokenization/parsing of input, 
history/feed, and command execution.

## What does it do?
So far, you can enter a few commands, and get some output, and/or change the shell environment. Typing commands will actually give
a loose syntax styling for the program/command name, parameter flags, and arguments. There are a couple filesystem programs that can
be ran to play around in a mock-filesystem. Currently it only supports `ls, stat, and cat` for filesystem. Working on getting `cd` working.
A simple but fun one is the `theme` command that changes the styling and syntax coloring on the fly.

## Plans for the Future
This is more of a pet project, but I initially wanted it as extensible as possible. With a few core commands to navigate around the prompt, 
and more importantly, extend the functionality on-the-fly. So I'm planning a package manager program built-in that will fetch programs 
by downloading them and injecting them into the document. This way the core stays small (currently ~112KB), but more functionality can be 
installed. Much like `npm` or `apt-get`.

Also considering a remote-shell type program as well, that swaps out the current shell for a websocket/AJAX connected one. Essentially, just 
connecting to a backend server and having the prompt echo commands into it, and print the results. Could be cool for hackathons, api testing, etc.

## How does it work?
### Shell
The whole `Shell` is just one component. It tracks the state of the shell, as well as handles commands coming in. It displays and controls the 
`Feed` and `Prompt` components. Feed manages the history and gives/handles no functionality, display only. Prompt handles the input events. 
Given a user input, it roughly tokenizes this and syntax colors it as needed. When enter is hit, it notifys the Shell of the full input string.

### Parser / Call
When Shell receives a command input from prompt it sends it to the parser. The parser first cleans the command (trims empty white space), and 
replaces any environment variables it finds (these are denoted as $ENV, ex. $PATH). Then it sends these for tokenization, which breaks the input 
up into an array of pieces based on white-space. The tokenizer does consider quotes and keeps those intact. From their, a call object is created.
The call object is basically just a manifest of the considered command structure. It treats the first token as command/program, and the rest as arguments. 
But! The arguments are roughly parsed based on if they start with `-`, which then denotes them as properties (read: flags/options).

Single '-' options are treated as boolean flags, so their option name is saved in a object. Double '-' options are treated as named arguments, 
so if textual argument comes after it, then that argument is snatched up and saved as the value of the option. Any other arguments floating around are 
stuffed into the arg array.

### Execution
Shell takes this call command, and packs it into a final execution map with contains the same call data as well as the shell state such 
as username, host, path, environment variables, etc. From their it checks the command name against a map of internal commands, if not found, 
it checks the program directory in the same way. If something matches, then it calls the function under that key and passes the execution properties.

Commands and programs are functions that take in an object known as the execution properties and return either null, string, object, or Promise.
If it's a Promise, then the Promise should resolve down to either null, string, or object. Null is treated as no-output. String is treated as 
raw stdout output. And object contains either shell instructions, stdout output, or both. Shell instructions inform the shell how to change it's 
state based on the program ran. Otherwise, stdout is the main output throughout.

### Output
When output is received from program execution, it get's parsed itself. As of now, this is just string formatting to replace environment variables 
on it's way to output. But later on this will clean, validate, and further format the output. Such as possibly emulating ANSI/VT100 escape characters.

### Final
With the output now parsed and formatted, the Shell makes the necessary state modifications and then passes the original prompt value, 
and the stdout results to the Feed object to store as history. This completes the process.

### Writing programs yourself
Until package manager is built, there's no great way to add programs without manually changing the sourcecode here. But writing the actual programs is easy...

Programs are just functions. They take (optionally) the execution properties, and return either null (no output), or string (raw output).
Programs are executed in a Promise chain, so returning a Promise that resolves to one of those is a `GREAT` option.

Either way the outline of execution properties looks like this:

`> programname argument1 -f --prop propertyValue argument2`
```json
{
  "cmd": "programname",
  "args": ["argument1", "argument2"],
  "props": {
    "f": true,
    "prop": "propertyValue"
  },
  "rawArgs": ["argument1", "-f", "--prop", "propertyValue", "argument2"],
  "env": {
    "home": "/home/user",
    "path": "/home/user"
  },
  "path": "/home",
  "user": "user",
  "hostname": "localhost"
}
```

The function for your program can then return a string, or a promuse that resolves to a string, and that will be outputted to the feed.
Feed output is surrounded by a `<pre>` tag, so \n and \t are respected.
