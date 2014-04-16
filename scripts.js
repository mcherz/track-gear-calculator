var leftSelection = 50;
var rightSelection = 15;

var gearMultiplier = 27;

var currentGearKey = 71;

var menuOpen = false;
var leftTouch = false;
var rightTouch = false;
var inchTouch = false;

var tapFlag = false;
var leftTimeout;
var rightTimeout;
var lastTapTime;

var swipeFlag = true;
var swipeTimeout;

var handFlag = false;

var menuOpenCloseSpeed = 400;
var menuOpenBottom;
var menuOpenLeft;
var menuClosedLeft;

var deltaAngle = 0;
var startTransform = 0;

var inchStartX;
var inchStartY;
var deltaValue;
var modifyKeyForAvailability = 0;
var previousdeltaValue = 0;

var gearArrayFromAll = [];

$(document).ready(function() {
	initTouchOverrides();
	initializeGearsFromLocalStorage();
	setDefaultHandlers();
	setDefaultValues();
});

$(window).resize(function() {
	setDefaultValues();
	if (menuOpen) {
		$('#menuButton').css('left', menuOpenLeft);
	} else {
		$('#menuButton').css('left', menuClosedLeft);
	}
});

function setDefaultHandlers() {
	inchesTouchSetup();
	leftCircleTouchSetup();
	rightCircleTouchSetup();
	$('#menuButton').off('mousedown').on('mousedown',function(e) {
		if  (isJQMGhostClick()) { return; }
		e.preventDefault();
		menuButtonTap();

	});
	setCheckboxListeners();
	setWheelDiameterListeners();
}

function setDefaultValues() {
	menuOpenBottom = (window.innerHeight - 50) + 'px';
	menuOpenLeft = (window.innerWidth - 50) + 'px';
	if (window.innerHeight > window.innerWidth) {
		menuClosedLeft = '0px';
	} else {
		menuClosedLeft = '110px';
	}
}

function menuButtonTap(){

	if (menuOpen) {
		menuOpen = false;

		var hasSeenFlag = localStorage.getItem('hasSeenFlag');

		if (hasSeenFlag !== 'true') {
				addFTUXHand();
		}

		if (window.innerHeight > window.innerWidth) {
			$('#menuButton').animate({bottom: "0px", left: '0px'}, menuOpenCloseSpeed);
		} else {
			$('#menuButton').animate({bottom: "0px", left: '110px'}, menuOpenCloseSpeed);
		}
		$('#menuButtonWrenches').animate({opacity: '1'}, menuOpenCloseSpeed);
		$('#menuButtonClose').animate({opacity: '0'}, menuOpenCloseSpeed);
		$('#menu').animate({top: '100%'}, menuOpenCloseSpeed);
	} else {
		menuOpen = true;
		$('#menuButton').animate({bottom: menuOpenBottom, left: menuOpenLeft}, menuOpenCloseSpeed);
		$('#menuButtonWrenches').animate({"opacity": '0'}, menuOpenCloseSpeed);
		$('#menuButtonClose').animate({"opacity": '1'}, menuOpenCloseSpeed);
		$('#menu').animate({top: '0%'}, menuOpenCloseSpeed);
	}
}

function leftCircleTouchSetup() {

	$('#leftCircleCanvas').off('mousedown').on('mousedown', function(e) {
		if  (isJQMGhostClick()) { return; }
		e.preventDefault();
		tapFlag = true;
		
		leftTimeout = setTimeout(function() {
			tapFlag = false;
		}, 150);

		leftTouch = true;

		var offset = $(this).offset();
    	var dx = e.clientX - offset.left - 300;
    	var dy = e.clientY - offset.top - 300;

    	deltaAngle = (Math.atan2(dy,dx) * 180 / Math.PI); 

    	startTransform = getRotationDegrees($('#leftCircleLabels'));


	});

	$('#leftCircleCanvas').off('mousemove').on('mousemove', function(e) {
		e.preventDefault();
		if (leftTouch) {
			if (tapFlag) {
				clearTimeout(leftTimeout);
				tapFlag = false;
			}

			var offset = $(this).offset();
 		   	var dx = e.clientX - offset.left - 300;
    		var dy = e.clientY - offset.top - 300;

    		var mouseAngle = (Math.atan2(dy,dx) * 180 / Math.PI);
    
    		var transformAngle = startTransform + mouseAngle - deltaAngle;


    		var cssValue = 'rotate(' + transformAngle + 'deg)';


    		$('#leftCircleLabels').css('-webkit-transform', cssValue).css('transform', cssValue).css('-ms-transform', cssValue);

		}
	});

	$('#leftCircleCanvas').off('mouseup mouseout').on('mouseup mouseout', function(e) {
		e.preventDefault();
		if (leftTouch) {
			leftTouch = false;

		    if (tapFlag) {


			clearTimeout(leftTimeout);
			tapFlag = false;
		    	
			var offset = $(this).offset();        
		   	var dx = e.clientX - offset.left;
    		var dy = e.clientY - offset.top;

    		var angleStep = 10;
        
        	var currentRotation = getRotationDegrees($('#leftCircleLabels'));
        	var time;
        	var rotationOffset;
        	var newSelection;

        	var maxGear = 56;
        	var minGear = 44;
              
	        if  (dx > 460 && dx < 520 && dy > 493 && dy <= 527 && maxGear - leftSelection > 4) {
	            
	        newSelection = leftSelection + 5;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 350;
	            rotationOffset = -(5 * angleStep);
	            
		        leftSelection = newSelection;
		        $('#leftCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            
	        } else if (dx > 480 && dx < 540 && dy > 458 && dy <= 493 && maxGear - leftSelection > 3) {
	            
	         newSelection = leftSelection + 4;
	         //   self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 300;
	            rotationOffset = -(4 * angleStep);
	            
		        leftSelection = newSelection;
		        $('#leftCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            	            
	        } else if (dx > 500 && dx < 570 && dy > 417 && dy <= 458 && maxGear - leftSelection > 2) {
	            
	        newSelection = leftSelection + 3;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            time = 250;
	            rotationOffset = -(3 * angleStep);
	            
		        leftSelection = newSelection;
		        $('#leftCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);

	        } else if (dx > 520 && dx < 590 && dy > 371 && dy <= 417 && maxGear - leftSelection > 1) {
	            
	        newSelection = leftSelection + 2;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 200;
	            rotationOffset = -(2 * angleStep);
	            
		        leftSelection = newSelection;
		        $('#leftCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            
	        } else if  (dx > 535 && dx < 600 && dy > 326 && dy <= 371 && maxGear - leftSelection > 0) {
	            
	        newSelection = leftSelection + 1;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            time = 200;
	            rotationOffset = -(1 * angleStep);
	            
		        leftSelection = newSelection;
		        $('#leftCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            
	        } else if (dx > 535 && dx < 600 && dy > 232 && dy < 278 && leftSelection - minGear > 0) {
	            
	        newSelection = leftSelection - 1;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 200;
	            rotationOffset = (1 * angleStep);
	            
		        leftSelection = newSelection;
		        $('#leftCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
    
	        } else if (dx > 520 && dx < 590 && dy > 186 && dy <= 232 && leftSelection - minGear > 1) {
	            
	        newSelection = leftSelection - 2;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 200;
	            rotationOffset = (2 * angleStep);
	            
		        leftSelection = newSelection;
		        $('#leftCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            
	        } else if (dx > 500 && dx < 570 && dy > 145 && dy <= 186 && leftSelection - minGear > 2) {
	            
	        newSelection = leftSelection - 3;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 250;
	            rotationOffset = (3 * angleStep);
	            
		        leftSelection = newSelection;
		        $('#leftCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            
	        } else if (dx > 480 && dx < 540 && dy > 110 && dy <= 145 && leftSelection - minGear > 3) {
	            
	        newSelection = leftSelection - 4;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 300;
	            rotationOffset = (4 * angleStep);
	            
		        leftSelection = newSelection;
		        $('#leftCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            	            
	        } else {
	        	return;
	        }

    	} else {
		    var springBackAngle = 0;
		    var angleStep = 10;
		    var finalRotation = getRotationDegrees($('#leftCircleLabels'));
	    
		    if(finalRotation > 5.5 * angleStep)
			    {
			        springBackAngle = finalRotation - 6 * angleStep;
					leftSelection = 44;
			    }
		    else if(finalRotation > 4.5 * angleStep)
			    {
			        springBackAngle = finalRotation - 5 * angleStep;
					leftSelection = 45;
			    }
		    else if(finalRotation > 3.5 * angleStep)
			    {
			        springBackAngle = finalRotation - 4 * angleStep;
					leftSelection = 46;
			    }
		    else if(finalRotation > 2.5 * angleStep)
			    {
			        springBackAngle = finalRotation - 3 * angleStep;
					leftSelection = 47;
			    }
		    else if(finalRotation > 1.5 * angleStep)
			    {
			        springBackAngle = finalRotation - 2 * angleStep;;
					leftSelection = 48;
			    }
		    else if(finalRotation > 0.5 * angleStep)
			    {
			        springBackAngle = finalRotation - 1 * angleStep;
					leftSelection = 49;
			    }
		    else if(finalRotation > (-0.5) * angleStep)
			    {
			        springBackAngle = finalRotation;
					leftSelection = 50;
			    }
		    else if(finalRotation > (-1.5) * angleStep)
			    {
			        springBackAngle = finalRotation - (-1) * angleStep;
					leftSelection = 51;
			    }
		    else if(finalRotation > (-2.5) * angleStep)
			    {
			        springBackAngle = finalRotation - (-2) * angleStep;
					leftSelection = 52;
			    }
		    else if(finalRotation > (-3.5) * angleStep)
			    {
			        springBackAngle = finalRotation - (-3) * angleStep;
					leftSelection = 53;
			    }
		    else if(finalRotation > (-4.5) * angleStep)
			    {
			        springBackAngle = finalRotation - (-4) * angleStep;
					leftSelection = 54;
			    }
		    else if(finalRotation > (-5.5) * angleStep)
			    {
			        springBackAngle = finalRotation - (-5) * angleStep;
					leftSelection = 55;
			    }
		    else
			    {
			        springBackAngle = finalRotation - (-6) * angleStep;
					leftSelection = 56;
			    }

		    $('#leftCircleLabels').animateRotate(finalRotation, (finalRotation - springBackAngle), 200)
		}
		setGearInchMeasurement(leftSelection, rightSelection);
		setCurrentGearIndex();
		}
	});
}

function rightCircleTouchSetup() {

	$('#rightCircleCanvas').off('mousedown').on('mousedown', function(e) {
		if  (isJQMGhostClick()) { return; }
		e.preventDefault();
		tapFlag = true;
		
		rightTimeout = setTimeout(function() {
			tapFlag = false;
		}, 150);

		rightTouch = true;

		var offset = $(this).offset();
    	var dx = e.clientX - offset.left - 150;
    	var dy = e.clientY - offset.top - 150;

    	deltaAngle = (Math.atan2(dy,dx) * 180 / Math.PI); 

    	startTransform = getRotationDegrees($('#rightCircleLabels'));

	});

	$('#rightCircleCanvas').off('mousemove').on('mousemove', function(e) {
		e.preventDefault();
		if (rightTouch) {
			if (tapFlag) {
				clearTimeout(rightTimeout);
				tapFlag = false;
			}

			var offset = $(this).offset();
 		   	var dx = e.clientX - offset.left - 150;
    		var dy = e.clientY - offset.top - 150;


    		var mousemoveAngle = (Math.atan2(dy,dx) * 180 / Math.PI);

    		var transformAngle = startTransform + mousemoveAngle - deltaAngle;

    		var cssValue = 'rotate(' + transformAngle + 'deg)';

    		$('#rightCircleLabels').css('-webkit-transform', cssValue).css('transform', cssValue).css('-ms-transform', cssValue);

		}
	});

	$('#rightCircleCanvas').off('mouseup mouseout').on('mouseup mouseout', function(e) {
		e.preventDefault();
		if (rightTouch) {
		rightTouch = false;

		    if (tapFlag) {


			clearTimeout(rightTimeout);
			tapFlag = false;
		    	
			var offset = $(this).offset();        
		   	var dx = e.clientX - offset.left;
    		var dy = e.clientY - offset.top;

    		var angleStep = 22;
        
        	var currentRotation = getRotationDegrees($('#rightCircleLabels'));
        	var time;
        	var rotationOffset;
        	var newSelection;

        	var maxGear = 20;
        	var minGear = 12;
              
	        if (dx > 81 && dx < 115 && dy > 13 && dy <= 63 && maxGear - rightSelection > 2) {
	            
	        newSelection = rightSelection + 3;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];

	            time = 250;
	            rotationOffset = -(3 * angleStep);
	            
		        rightSelection = newSelection;
		        $('#rightCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);

	        } else if (dx > 40 && dx < 81 && dy > 50 && dy <= 87 && maxGear - rightSelection > 1) {
	            
	        newSelection = rightSelection + 2;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 200;
	            rotationOffset = -(2 * angleStep);
	            
		        rightSelection = newSelection;
		        $('#rightCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            
	        } else if  (dx > 10 && dx < 70 && dy > 87 && dy <= 132 && maxGear - rightSelection > 0) {
	            
	        newSelection = rightSelection + 1;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];

	            time = 200;
	            rotationOffset = -(1 * angleStep);
	            
		        rightSelection = newSelection;
		        $('#rightCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            
	        } else if (dx > 10 && dx < 70 && dy > 168 && dy < 213 && rightSelection - minGear > 0) {
	            
	        newSelection = rightSelection - 1;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 200;
	            rotationOffset = (1 * angleStep);
	            
		        rightSelection = newSelection;
		        $('#rightCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
    
	        } else if (dx > 40 && dx < 81 && dy > 213 && dy <= 250 && rightSelection - minGear > 1) {
	            
	        newSelection = rightSelection - 2;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 200;
	            rotationOffset = (2 * angleStep);
	            
		        rightSelection = newSelection;
		        $('#rightCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            
	        } else if (dx > 81 && dx < 115 && dy > 237 && dy <= 286 && rightSelection - minGear > 2) {
	            
	        newSelection = rightSelection - 3;
	        //    self.selection = [NSString stringWithFormat:@"%i", newSelection];
	            
	            time = 250;
	            rotationOffset = (3 * angleStep);
	            
		        rightSelection = newSelection;
		        $('#rightCircleLabels').animateRotate(currentRotation, (currentRotation + rotationOffset), time);
	            
	        } else {
	        	return;
	        }


    	} else {

		    var springBackAngle = 0;
		    var angleStep = 22;
		    var finalRotation = getRotationDegrees($('#rightCircleLabels'));
	    
		    if(finalRotation > 2.5 * angleStep)
			    {
			        springBackAngle = finalRotation - 3 * angleStep;
					rightSelection = 12;
			    }
		    else if(finalRotation > 1.5 * angleStep)
			    {
			        springBackAngle = finalRotation - 2 * angleStep;;
					rightSelection = 13;
			    }
		    else if(finalRotation > 0.5 * angleStep)
			    {
			        springBackAngle = finalRotation - 1 * angleStep;
					rightSelection = 14;
			    }
		    else if(finalRotation > (-0.5) * angleStep)
			    {
			        springBackAngle = finalRotation;
					rightSelection = 15;
			    }
		    else if(finalRotation > (-1.5) * angleStep)
			    {
			        springBackAngle = finalRotation - (-1) * angleStep;
					rightSelection = 16;
			    }
		    else if(finalRotation > (-2.5) * angleStep)
			    {
			        springBackAngle = finalRotation - (-2) * angleStep;
					rightSelection = 17;
			    }
		    else if(finalRotation > (-3.5) * angleStep)
			    {
			        springBackAngle = finalRotation - (-3) * angleStep;
					rightSelection = 18;
			    }
		    else if(finalRotation > (-4.5) * angleStep)
			    {
			        springBackAngle = finalRotation - (-4) * angleStep;
					rightSelection = 19;
			    }
		    else
			    {
			        springBackAngle = finalRotation - (-5) * angleStep;
					rightSelection = 20;
			    }

		    $('#rightCircleLabels').animateRotate(finalRotation, (finalRotation - springBackAngle), 200)
		}
		setGearInchMeasurement(leftSelection, rightSelection);
		setCurrentGearIndex();
		}
	});
}

function inchesTouchSetup() {

	$('#resultsHolder').off('mousedown').on('mousedown', function(e){
		if  (isJQMGhostClick()) { return; }
		e.preventDefault();

		modifyKeyForAvailability = 0;

		inchTouch = true;

		$('#measurement').css('color', '#aaff43');

		deltaValue = 0;
		previousdeltaValue = 0;
		
    	inchStartX = e.clientX;
    	inchStartY = e.clientY;


    	swipeFlag = true;

    	var swipeTimeout = setTimeout(function(){
    		swipeFlag = false;
    	}, 200);

	});

	$('#resultsHolder').off('mousemove').on('mousemove', function(e){
		e.preventDefault();
	
		if (inchTouch) {

		if (handFlag) {
			removeFTUXHand();
		}


		
		var deltaX = e.clientX - inchStartX;
		var deltaY = e.clientY - inchStartY;

		var sign = 1;

		if (deltaX + deltaY < 0) { sign = -1; }

    	deltaValue = sign*(Math.round(Math.sqrt((deltaX * deltaX/3600) + (deltaY*deltaY/3600))))

    	//begin objC paste

    	var modifyUp = 0;
	    var modifyDown = 0;
	    var upInches = 1000;
	    var downInches = -1000;
	    var staticGearArrayCountAbove = gearArrayFromAll.length - currentGearKey - 1;
	    var keepSearchingForBiggerGears = true;
	    var keepSearchingForSmallerGears = true;

	    var i=0;
	    var j=0;
	    var k=0;
	    var l=0;

	    var upGear = {};
	    var downGear = {};
	    
	    if (!swipeFlag) {
	    
	    var tempGearKey = currentGearKey + deltaValue + modifyKeyForAvailability;

	    if (tempGearKey < gearArrayFromAll.length && tempGearKey >=0) {

	        var tempGear = gearArrayFromAll[tempGearKey];
	        
	        if (!tempGear.isOn) {


	            if (deltaValue > previousdeltaValue) {
               
	                while (i < staticGearArrayCountAbove && keepSearchingForBiggerGears) {
	                    
	                    var upGearKey = currentGearKey + deltaValue + modifyKeyForAvailability + i;
	                    
	                    //make sure gear is in bounds
	                    if (upGearKey < gearArrayFromAll.length && upGearKey >= 0) {
	                        upGear = gearArrayFromAll[upGearKey];
	                    } else {
	                        upGear.isOn = false;
	                    }
	                    
	                    
	                    //check gears for on-ness
	                    if (upGear.isOn) {
	                        modifyUp = i;
	                        upInches = upGear.inches;
	                        keepSearchingForBiggerGears = false;
	                    }
	                    
	                    i++;
	                    
	                }
	                
	                modifyKeyForAvailability += modifyUp;
	                
	                if (keepSearchingForBiggerGears) {
	                    
	                    while (j < gearArrayFromAll.length && keepSearchingForBiggerGears) {
	                        
	                        var downGearKey = currentGearKey + deltaValue + modifyKeyForAvailability - j;

	                        //make sure gear is in bounds
	                        if (downGearKey < gearArrayFromAll.length && downGearKey >= 0) {
	                            downGear = gearArrayFromAll[downGearKey];
	                        } else {
	                            downGear.isOn = false;
	                        }
	                        
	                        
	                        //check gears for on-ness
	                        if (downGear.isOn) {
	                            modifyDown = -j;
	                            downInches = downGear.inches;
	                            keepSearchingForBiggerGears = false;
	                        }
	                        
	                        j++;
	                        
	                    }

	                    modifyKeyForAvailability += modifyDown;

	                }

	                
	            } else if (deltaValue < previousdeltaValue) {

	                while (k <= tempGearKey && keepSearchingForSmallerGears) {
	                    var downGearKey = currentGearKey + deltaValue + modifyKeyForAvailability - k;
	                    if (downGearKey < gearArrayFromAll.length && downGearKey >= 0) {
	                        downGear = gearArrayFromAll[downGearKey];
	                    } else {
	                        downGear.isOn = false;

	                    }
	                    
	                    //check gears for on-ness
	                    if (downGear.isOn) {
	                        modifyDown = -k;
	                        downInches = downGear.inches;
	                        keepSearchingForSmallerGears = false;
	                    }
	                    
	                    k++;
	                    
	                }
	                
	                modifyKeyForAvailability += modifyDown;
	                
	                if (keepSearchingForSmallerGears) {
	                    while (l < gearArrayFromAll.length && keepSearchingForSmallerGears) {
	                        
	                        var upGearKey = currentGearKey + deltaValue + modifyKeyForAvailability + l;
	                        
	                        //make sure gear is in bounds
	                        if (upGearKey < gearArrayFromAll.length && upGearKey >= 0) {
	                            upGear = gearArrayFromAll[upGearKey];
	                        } else {
	                            upGear.isOn = false;
	                        }
	                        
	                        
	                        //check gears for on-ness
	                        if (upGear.isOn) {
	                            modifyUp = l;
	                            upInches = upGear.inches;
	                            keepSearchingForSmallerGears = false;
	                        }
	                        
	                        l++;
	                        
	                    }
	                    
	                    modifyKeyForAvailability += modifyUp;
	                
	                }
	                
	    
	            }
	            

	            
	        }

	        var updatedGearKey = currentGearKey + deltaValue + modifyKeyForAvailability;
	        
	        if (updatedGearKey < 0) {
	            updatedGearKey = 0;
	        }
	        
	        if (updatedGearKey >= gearArrayFromAll.length) {
	            updatedGearKey = gearArrayFromAll.length - 1;
	        }
	        
	        var updatedGear = gearArrayFromAll[updatedGearKey];
	       

	        setGearInchMeasurement(updatedGear.ring, updatedGear.cog);
	        previousdeltaValue = deltaValue;
	    }
	        
    }
    

    	}

	});

	$('#resultsHolder').off('mouseup mouseout').on('mouseup mouseout', function(e){
		e.preventDefault();
		if (inchTouch) {

		inchTouch = false;

		$('#measurement').css('color', '#ffffff');

		var deltaX = e.clientX - inchStartX;
		var deltaY = e.clientY - inchStartY;

		var sign = 1;

		if (deltaX + deltaY < 0) { sign = -1; }

    	deltaValue = sign*(Math.round(Math.sqrt((deltaX * deltaX/3600) + (deltaY*deltaY/3600))))

	    if (swipeFlag) {
	        //reset changes and increment/decrement by one in case of fast swipe
	        if (deltaValue > 0) {
	            deltaValue = 1;
	        } else if (deltaValue < 0){
	            deltaValue = -1;
	        }
	        modifyKeyForAvailability = 0;
	        previousChangeInValue = 0;
	    }
	    


		var modifyUp = 0;
	    var modifyDown = 0;
	    var upInches = 1000;
	    var downInches = -1000;
	    var staticGearArrayCountAbove = gearArrayFromAll.length - currentGearKey - 1;
	    var keepSearchingForBiggerGears = true;
	    var keepSearchingForSmallerGears = true;

	    var i=0;
	    var j=0;
	    var k=0;
	    var l=0;

	    var upGear = {};
	    var downGear = {};
	    
	    var tempGearKey = currentGearKey + deltaValue + modifyKeyForAvailability;

	    if (tempGearKey < gearArrayFromAll.length && tempGearKey >=0) {

	        var tempGear = gearArrayFromAll[tempGearKey];
	        
	        if (!tempGear.isOn) {


	            if (deltaValue > previousdeltaValue) {
	                
	                while (i < staticGearArrayCountAbove && keepSearchingForBiggerGears) {
	                    
	                    var upGearKey = currentGearKey + deltaValue + modifyKeyForAvailability + i;
	                    
	                    //make sure gear is in bounds
	                    if (upGearKey < gearArrayFromAll.length && upGearKey >= 0) {
	                        upGear = gearArrayFromAll[upGearKey];
	                    } else {
	                        upGear.isOn = false;
	                    }
	                    
	                    
	                    //check gears for on-ness
	                    if (upGear.isOn) {
	                        modifyUp = i;
	                        upInches = upGear.inches;
	                        keepSearchingForBiggerGears = false;
	                    }
	                    
	                    i++;
	                    
	                }
	                
	                modifyKeyForAvailability += modifyUp;
	                
	                if (keepSearchingForBiggerGears) {
	                    
	                    while (j < gearArrayFromAll.length && keepSearchingForBiggerGears) {
	                        
	                        var downGearKey = currentGearKey + deltaValue + modifyKeyForAvailability - j;

	                        //make sure gear is in bounds
	                        if (downGearKey < gearArrayFromAll.length && downGearKey >= 0) {
	                            downGear = gearArrayFromAll[downGearKey];
	                        } else {
	                            downGear.isOn = false;
	                        }
	                        
	                        
	                        //check gears for on-ness
	                        if (downGear.isOn) {
	                            modifyDown = -j;
	                            downInches = downGear.inches;
	                            keepSearchingForBiggerGears = false;
	                        }
	                        
	                        j++;
	                        
	                    }

	                    modifyKeyForAvailability += modifyDown;

	                }

	                
	            } else if (deltaValue < previousdeltaValue) {
	                
	                while (k <= tempGearKey && keepSearchingForSmallerGears) {
	                    
	                    var downGearKey = currentGearKey + deltaValue + modifyKeyForAvailability - k;
	                    if (downGearKey < gearArrayFromAll.length && downGearKey >= 0) {
	                        downGear = gearArrayFromAll[downGearKey];
	                    } else {
	                        downGear.isOn = false;
	                    }
	                    
	                    //check gears for on-ness
	                    if (downGear.isOn) {
	                        modifyDown = -k;
	                        downInches = downGear.inches;
	                        keepSearchingForSmallerGears = false;
	                    }
	                    
	                    k++;
	                    
	                }
	                
	                modifyKeyForAvailability += modifyDown;
	                
	                if (keepSearchingForSmallerGears) {
	                    while (l < gearArrayFromAll.length && keepSearchingForSmallerGears) {
	                        
	                        var upGearKey = currentGearKey + deltaValue + modifyKeyForAvailability + l;
	                        
	                        //make sure gear is in bounds
	                        if (upGearKey < gearArrayFromAll.length && upGearKey >= 0) {
	                            upGear = gearArrayFromAll[upGearKey];
	                        } else {
	                            upGear.isOn = false;
	                        }
	                        
	                        
	                        //check gears for on-ness
	                        if (upGear.isOn) {
	                            modifyUp = l;
	                            upInches = upGear.inches;
	                            keepSearchingForSmallerGears = false;
	                        }
	                        
	                        l++;
	                        
	                    }
	                    
	                    modifyKeyForAvailability += modifyUp;
	                
	                }
	                
	    
	            }
	            

	            
	        }

	        var updatedGearKey = currentGearKey + deltaValue + modifyKeyForAvailability;
	        
	        if (updatedGearKey < 0) {
	            updatedGearKey = 0;
	        }
	        
	        if (updatedGearKey >= gearArrayFromAll.length) {
	            updatedGearKey = gearArrayFromAll.length - 1;
	        }
	        
	        var updatedGear = gearArrayFromAll[updatedGearKey];
	       

	        setGearInchMeasurement(updatedGear.ring, updatedGear.cog);
	        leftSelection = updatedGear.ring;
	        rightSelection = updatedGear.cog;

	        currentGearKey = updatedGearKey;

	        var currentLeftAngle = getRotationDegrees($('#leftCircleLabels'));
	        var currentRightAngle = getRotationDegrees($('#rightCircleLabels'));

	        var newLeftAngle = (10 * (50 - leftSelection));
	        var newRightAngle = (22 * (15 - rightSelection));

	        $('#leftCircleLabels').animateRotate(currentLeftAngle, newLeftAngle, 300);
	        $('#rightCircleLabels').animateRotate(currentRightAngle, newRightAngle, 300);

    	}
    }

	});
}

function setCheckboxListeners() {
	$('.regular-checkbox').off('click').on('click', function(e){
		if  (isJQMGhostClick()) { return; }
		var checkboxID = e.target.id;
		var switchString = checkboxID.substring(6,8);
		var boolString;
		if ($(this).prop('checked')) {
		boolString = "1";
		} else {
		boolString = "0";
		}
		localStorage.setItem(switchString,boolString);
		initializeGearsFromLocalStorage();
	});
}

function setWheelDiameterListeners() {

	gearMultiplierIndex = localStorage.getItem('diameterIndex');

	if (gearMultiplierIndex == '0') {

		highlightSelector0();
	} else if (gearMultiplierIndex == '1') {

		highlightSelector1();
	} else if (gearMultiplierIndex == '2') {

		highlightSelector2();
	}



	$('#selector0').off('mousedown').on('mousedown', function(e){
		if  (isJQMGhostClick()) { return; }
		e.preventDefault();
		if (!$('#selector0').hasClass('selectorActive')) {
			highlightSelector0();
		}
	});

	$('#selector1').off('mousedown').on('mousedown', function(e){
		if  (isJQMGhostClick()) { return; }
		e.preventDefault();
		if (!$('#selector1').hasClass('selectorActive')) {
			highlightSelector1();
		}
	});

	$('#selector2').off('mousedown').on('mousedown', function(e){
		if  (isJQMGhostClick()) { return; }
		e.preventDefault();
		if (!$('#selector2').hasClass('selectorActive')) {
			highlightSelector2();
		}
	});
}

function highlightSelector0() {
	$('#selector0').removeClass('selectorPassive').addClass('selectorActive');
	if ($('#selector1').hasClass('selectorActive')) {
		$('#selector1').removeClass('selectorActive').addClass('selectorPassive');
	} else {
		$('#selector2').removeClass('selectorActive').addClass('selectorPassive');				
	}
	gearMultiplier = 27;
	localStorage.setItem('diameterIndex', '0');
	initializeGearsFromLocalStorage();
	setGearInchMeasurement(leftSelection, rightSelection);
}

function highlightSelector1() {
	$('#selector1').removeClass('selectorPassive').addClass('selectorActive');
	if ($('#selector0').hasClass('selectorActive')) {
		$('#selector0').removeClass('selectorActive').addClass('selectorPassive');
	} else {
		$('#selector2').removeClass('selectorActive').addClass('selectorPassive');				
	}
	gearMultiplier = 26.2794;
	localStorage.setItem('diameterIndex', '1');
	initializeGearsFromLocalStorage();
	setGearInchMeasurement(leftSelection, rightSelection);
}

function highlightSelector2() {
	$('#selector2').removeClass('selectorPassive').addClass('selectorActive');
	if ($('#selector0').hasClass('selectorActive')) {
		$('#selector0').removeClass('selectorActive').addClass('selectorPassive');
	} else {
		$('#selector1').removeClass('selectorActive').addClass('selectorPassive');				
	}
	gearMultiplier = 26.1415;
	localStorage.setItem('diameterIndex', '2');
	initializeGearsFromLocalStorage();
	setGearInchMeasurement(leftSelection, rightSelection);
}

function setCurrentGearIndex() {
	var currentInches = gearMultiplier * leftSelection / rightSelection;
	var index = 0;
	for (gear in gearArrayFromAll) {
		var theseGearInches = gearArrayFromAll[gear].inches;
        if (theseGearInches == currentInches) {
            currentGearKey = index;
        }
        index++;
    }
}

function getRotationDegrees($obj) {
    var matrix = $obj.css("-webkit-transform") ||
    $obj.css("-moz-transform")    ||
    $obj.css("-ms-transform")     ||
    $obj.css("-o-transform")      ||
    $obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = (Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return angle;
}

function setGearInchMeasurement(ring, cog) {
	var inches = Math.round( 10 * gearMultiplier * ring / cog )/10;
	var inchText = inches.toFixed(1);
	var descriptorText = ring + " x " + cog + " is a";
	if (inches >= 80 && inches < 90) {
		descriptorText += "n";
	}
	$('#measurement').html(inchText);
	$('#gearDescription').html(descriptorText);
}

function initializeGearsFromLocalStorage() {

	gearArrayFromAll.length = 0;

	if (localStorage.getItem("hasRun") === null) {
		setupLocalStorage();
	}

	gearMultiplierIndex = localStorage.getItem('diameterIndex');

	if (gearMultiplierIndex == '0') {
		gearMultiplier = 27;
	} else if (gearMultiplierIndex == '1') {
		gearMultiplier = 26.2794;
	} else if (gearMultiplierIndex == '2') {
		gearMultiplier = 26.1415;
	}

	for (i=44; i<=56; i++) {
		for (j=12; j<=20; j++) {
			var measurement = gearMultiplier * i / j;
			var ringString = "" + i;
			var cogString = "" + j;
			var ringOnString = localStorage.getItem(ringString);
			var cogOnString = localStorage.getItem(cogString);

			var ringInt = parseInt(ringOnString);
			var ringID = "#label" + ringString;
			
			if (ringInt !== 1) {

				$(ringID).removeClass().addClass('ringLabel').addClass('labelOff');
			} else {

				var ringSwitchID = "#switch" + ringString;
				$(ringSwitchID).prop('checked', true);

				$(ringID).removeClass().addClass('ringLabel').addClass('labelOn');
			}

			var cogInt = parseInt(cogOnString);

			if (cogInt !== 1) {
				var cogID = "#label" + cogString;
				$(cogID).removeClass().addClass('cogLabel').addClass('labelOff');
			} else {
				var cogID = "#label" + cogString;
				var cogSwitchID = "#switch" + cogString;
				$(cogSwitchID).prop('checked', true);
				$(cogID).removeClass().addClass('cogLabel').addClass('labelOn');
	
			}

			var isOnInt = ringInt + cogInt
			var isOnBool;
			if (isOnInt === 2) {
				isOnBool = true;
			} else {
				isOnBool = false;
			}

			var gear = {};
			gear.ring = i;
			gear.cog = j;
			gear.inches = measurement;
			gear.isOn = isOnBool;

			gearArrayFromAll.push(gear);

		}
	}
	gearArrayFromAll.sort(function(a,b) {
		return a.inches-b.inches;
	});

	setCurrentGearIndex();
	setGearInchMeasurement(leftSelection, rightSelection);
}

function setupLocalStorage() {

	localStorage.setItem('hasRun', "true");

	localStorage.setItem('hasSeenFlag', 'false');

	localStorage.setItem('diameterIndex', '0');

	for (i=44; i<=56; i++) {
		var keyString = "" + i;
		localStorage.setItem(keyString, "1");
	}
	
	for (j=12; j<=20; j++) {
		var keyString = "" + j;
		localStorage.setItem(keyString, "1");
	}
}

function addFTUXHand() {
	handFlag = true;
	$('#theHandHolder, #theHand').removeClass('hidden');
	handAnimation();
}

function handAnimation() {
	$('#theHand').animate({'left': '90px'}, 900).animate({'left': '-55px'}, 900, function() {
		handAnimation();
	});
}

function removeFTUXHand() {
	handFlag = false;
	localStorage.setItem('hasSeenFlag', 'true');
	$('#theHand, #theHandHolder').stop().addClass('hidden');
}

$.fn.animateRotate = function(startAngle, endAngle, duration, easing, complete){
    return this.each(function(){
        var elem = $(this);

        $({deg: startAngle}).animate({deg: endAngle}, {
            duration: duration,
            easing: easing,
            step: function(now){
                elem.css({
                  '-moz-transform':'rotate('+now+'deg)',
                  '-webkit-transform':'rotate('+now+'deg)',
                  '-o-transform':'rotate('+now+'deg)',
                  '-ms-transform':'rotate('+now+'deg)',
                  'transform':'rotate('+now+'deg)'
                });
            },
            complete: complete || $.noop
        });
    });
}

function touchHandler(event) {
    var touch = event.changedTouches[0];

    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function initTouchOverrides() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}

function isJQMGhostClick() {
    var currTapTime = new Date().getTime();
    
    if(lastTapTime == null || currTapTime > (lastTapTime + 600)) {
        lastTapTime = currTapTime;
        return false;
    }
    else {
        return true;
    }
}
