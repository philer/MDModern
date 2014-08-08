MDModern
========
An HTML5 theme for MDM's webkit greeter.

This theme functions both as a regular theme and an easy to use dev kit.
You can simply use this theme as is and customize it using the available configuration options, or you can modify the sources to create something completely new.
Web developers may be happy to find several well documented JavaScript modules, including an easy-to-use MDM interface, which you can use to build your very own theme.


## Installation
To use this theme as is, copy the files to a new directory in `/usr/share/mdm/html-themes/`. If you have git, simply type `$ sudo git clone https://github.com/philer/mdmodern.git /usr/share/mdm/html-themes/` in a terminal to copy the files directly from github.
Rename `default-slideshow.conf` to `slideshow.conf` (see Customizing) and you're all set to select the theme in your MDM settings.

If you plan to edit the theme it may be useful to clone to somewhere else and then create a softlink via `ln -s`. In that case you'll have to make sure, that all files and directories can be read by MDM (set permissions to 777 for directories and 666 for files).


## Customizing

### Background Slideshow
Settings for the background slideshow are stored in `slideshow.conf`, which you need to create. You can do so by renaming `default-slideshow.conf`, which contains all default settings as well as a few wallpapers to get you started.

### Turning screen elements on and off
You can easily modify the `index.html` file to hide elements you don't need. Just comment out elements that you don't want by encasing them in `<!--` and `-->`. You'll also find elements that are deactivated by default so you can add them back in.
If you want to go deeper, read on in the next section.



## Modifying and creating your own theme

If you want to edit the JavaScript and CSS source you'll need NPM,
[Grunt](http://gruntjs.com/) and [LESS](http://lesscss.org/) installed. You may need to run `$ npm install` to get all the node modules used by Grunt.

The source files for the theme are located in the `less/` directory. In the `js/` directory you'll find multiple JavaScript modules that allow easy modification and extension. Check DOCUMENTATION.md for information about what modules are available.

Running `$ grunt` or `$ grunt watch` will build a development version with debugging log activated. When you're done editing, run `$grunt dist` to generate a production version without debugging. Don't forget to add new files to Gruntfile.js so they will be included in your builds.



## Contributing

Suggestions, bug reports and pull requests are very welcome.


