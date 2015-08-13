#BitShip
![BitShip logo](https://cloud.githubusercontent.com/assets/810579/8598046/6c409dce-2661-11e5-8e90-6115301b1764.png)

##What?
BitShip is a chrome extension that facilitates communication between [Bitbucket](http://bitbucket.org) and [Codeship](http://codeship.com)

##Where?
You can download this extension from the [official BitShip google chrome store page](https://chrome.google.com/webstore/detail/bitship/heagnhmcighohcbdgndgmebmcpfgadbd), or you can manually download and install it from the [latest release page](https://github.com/gion/BitShip/releases/latest).

##Why?
Because Codeship is awesome and Bitbucket is nice too...  
... and because there is no service that makes them play together like [github](http://github.com) and [travis](http://travis-ci.org) do so nicely out of the box.

##When?
It's a recent project. The actual development started 2 days ago, but the idea is in my head for a longer period of time.
After moving from Github to Bitbucket, I searched for a way to integrate Codeship as a Bitbucket service rather than a separate app that uses some git hooks. And after I found out that there aren't any other ways to achieve the classic Github-Travis combination with Bitbucket and Codeship, I decided to take the matter in my own hands and build a solution, hoping that it will be appealing to other developpers in my position too.

##How?
It may be easier to think of this extension as if they were 3 components:  
 - the actual extension
 - the part that communicates with the Codeship api
 - the part that interacts with the Bitbucket pages

 The extension was built using [yeoman](http://yeoman.io) and the [chrome extension kickstarter generator](https://github.com/HaNdTriX/generator-chrome-extension-kickstart) (thanks @HaNdTriX for it!).  
 Having a [Codeship Api Key](https://codeship.com/documentation/integrations/api/#get-a-api-key) makes it easy to do simple queries to collect data about Codeship projects and builds.  
 The extension itself runs (although it seems to be active all the time) only on Bitbucket pull request pages and asks Codeship for the user's project list. If the Bitbucket project that the extension runs on is in the project list, then (after *scraping* :( the pull request branch) BitShip gets the Codeship build status for the pull request.
 The next step is some kind of css voodoo magic that adds a class to the root node of the page. Based on that class, the pull request page UI is modified so it reveals the Codeship badge with a status message:  
 ![BitShip notification box](https://cloud.githubusercontent.com/assets/810579/8597770/f8f71132-265f-11e5-8981-de02ae428aa4.png)

 Moreover, if the build is't green, BitShip disables the merge/approve buttons in the pull request page so that no one can accept code that is error prone:  
 ![BitShip disabled UI](https://cloud.githubusercontent.com/assets/810579/8597851/721cb0a8-2660-11e5-9952-6b14919a9aaf.png)

##Who?
I'm [Gion](https://careers.stackoverflow.com/gion) and I want to make the web a better place (because I'm selfish and I want the internet to be better for me! >:)).  
Anyone who wants to contribute is invited to [submit an issue](https://github.com/gion/BitShip/issues/new) or a [pull request](https://github.com/gion/BitShip/compare) and be a part of the  *BitShip team*.  
