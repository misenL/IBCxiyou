import { toPx, CHAR_WIDTH_SCALE_MAP, base64ToPath  } from './utils'
import { GD } from './gradient'
let id = 0
let cache = {
	
}
export class Draw {
	constructor(context, canvas, use2dCanvas = false) {
		this.ctx = context
		this.canvas = canvas || null
		this.use2dCanvas = use2dCanvas
	}
	
	roundRect(x, y, w, h, r, fill = false, stroke = false) {
		if (r < 0) return
		const ctx = this.ctx

		ctx.beginPath()
		if(!r) {
			ctx.rect(x, y, w, h)
		} else {
			let {
				borderTopLeftRadius: tl = r || 0,
				borderTopRightRadius: tr = r || 0,
				borderBottomRightRadius: br = r || 0,
				borderBottomLeftRadius: bl = r || 0
			} = r || {r,r,r,r}
			ctx.beginPath()
			// 右下角
			ctx.arc(x + w - br, y + h - br, br, 0, Math.PI * 0.5)
			ctx.lineTo(x + bl, y + h)
			// 左下角
			ctx.arc(x + bl, y + h - bl, bl, Math.PI * 0.5, Math.PI)
			ctx.lineTo(x, y + tl)
			// 左上角
			ctx.arc(x + tl, y + tl, tl, Math.PI, Math.PI * 1.5)
			ctx.lineTo(x + w - tr, y)
			// 右上角
			ctx.arc(x + w - tr, y + tr, tr, Math.PI * 1.5, Math.PI * 2)
			ctx.closePath()
		}
		
		if (stroke) ctx.stroke()
		if (fill) ctx.fill()
	}
	measureText(text, fontSize) {
		const ctx = this.ctx
		// #ifndef APP-PLUS
		return ctx.measureText(text).width
		// #endif
		// #ifdef APP-PLUS
		// app measureText为0需要累加计算0
		return text.split("").reduce((widthScaleSum, char) => {
			let code = char.charCodeAt(0);
			let widthScale = CHAR_WIDTH_SCALE_MAP[code - 0x20] || 1;
			return widthScaleSum + widthScale;
		  }, 0) * fontSize;
		// #endif
	}
	setFont({fontFamily, fontSize, fontWeight, textStyle}) {
		let ctx = this.ctx
		// 设置属性
		// #ifndef MP-TOUTIAO
		fontWeight = fontWeight === 'bold' ? 'bold' : 'normal'
		textStyle =  textStyle === 'italic' ? 'italic' : 'normal'
		// #endif
		// #ifdef MP-TOUTIAO
		fontWeight = fontWeight === 'bold' ? 'bold' : ''
		textStyle =  textStyle === 'italic' ? 'italic' : ''
		// #endif
		fontSize = toPx(fontSize)
		ctx.font = `${textStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
	}
	
	drawBackground(bd, w, h) {
		const ctx = this.ctx
		if (!bd) {
			// #ifndef MP-TOUTIAO
			ctx.setFillStyle('transparent')
			// #endif
			// #ifdef MP-TOUTIAO
			ctx.setFillStyle('rgba(0,0,0,0)')
			// #endif
		// } else if(bd.startsWith('#') || bd.startsWith('rgba') || bd.toLowerCase() === 'transparent' ) {
			// ctx.setFillStyle(bd)
		} else if(GD.isGradient(bd)) {
			GD.doGradient(bd, w, h, ctx);
		} else {
			ctx.setFillStyle(bd)
		}
	}
	drawView(box, style) {
		const ctx = this.ctx
		const {
			left: x,
			top: y,
			width: w,
			height: h
		} = box
		let {
			boxShadow = [],
				borderRadius = 0,
				borderWidth = 0,
				borderStyle,
				borderColor,
				color = '#000000',
				backgroundColor: bg,
				rotate,
				shadow
		} = style
		ctx.save()
		// 旋转
		if (rotate) {
			ctx.translate(x + w / 2, y + h / 2)
			ctx.rotate(rotate * Math.PI / 180)
			ctx.translate(-x - w / 2, -y - h / 2)
		}

		// 投影
		if (boxShadow.length) {
			const [x, y, b, c] = boxShadow
			ctx.setShadow(x, y, b, c)
		}
		
		// 描边
		if (borderStyle) {
			ctx.lineWidth = borderWidth
			if (borderStyle == 'dashed') {
				ctx.setLineDash([Math.ceil(borderWidth * 4 / 3), Math.ceil(borderWidth * 4 / 3)])
			} else if (borderStyle == 'dotted') {
				ctx.setLineDash([borderWidth, borderWidth])
			}
			ctx.setStrokeStyle(borderColor)
		}
		// 背景
		this.drawBackground(bg, w, h)
		this.roundRect(x, y, w, h, borderRadius, true, borderColor ? true : false)

		ctx.restore()
	}
	async drawImage(img, box, style) {
		await new Promise(async (resolve, reject) => {
			const ctx = this.ctx
			
			const canvas = this.canvas
			const {
				borderRadius = 0,
				mode,
				backgroundColor: bg
			} = style
			const {
				left: x,
				top: y,
				width: w,
				height: h
			} = box
			ctx.save()
			// 背景
			this.drawBackground(bg || 'white', w, h)
			this.roundRect(x, y, w, h, borderRadius, true, false)
			ctx.clip()
			const _modeImage = (img) => {
				// 获得缩放到图片大小级别的裁减框
				let rWidth = img.width
				let rHeight = img.height
				let startX = 0
				let startY = 0
				// 绘画区域比例
				const cp = w / h
				// 原图比例
				const op = rWidth / rHeight
				if (cp >= op) {
					rHeight = rWidth / cp;
					// startY = Math.round((h - rHeight) / 2)
				} else {
					rWidth = rHeight * cp;
					startX = Math.round(((img.width || w) - rWidth) / 2)
				}
				if (mode === 'scaleToFill' || !img.width) {
					ctx.drawImage(img.path, x, y, w, h);
				} else {
					ctx.drawImage(img.path, startX, startY, rWidth, rHeight, x, y, w, h)
				}
			}
			const _drawImage = (img) => {
				if (this.use2dCanvas) {
					if(img.path.src) {
						_modeImage(img)
						ctx.restore()
						resolve()
					} else {
						const Image = canvas.createImage()
						Image.onload = () => {
							img.path = Image
							_modeImage(img)
							ctx.restore()
							resolve()
						}
						Image.onerror = () => {
							reject(new Error(`createImage fail: ${img}`))
						}
						Image.src = img.path
					}
					
				} else {
					_modeImage(img)
					ctx.restore()
					resolve()
				}
			}
			
			const baseReg = /^data:image\/(\w+);base64/
			const localReg = /^\.|^\/(?=[^\/])/;
			if(baseReg.test(img) && !cache[img]) {
				const imgName = img
				img = await base64ToPath(img)
				cache[imgName] = img
			}
			if(cache[img] && cache[img].errMsg) {
				_drawImage(cache[img])
			} else {
				uni.getImageInfo({
					src: img,
					success: (image) => {
						image.path = /^(http|\/\/|\/|wxfile|data:image\/(\w+);base64|file|bdfile|ttfile|blob)/.test(image.path) ? image.path : `/${image.path}`;
						cache[img] = image
						_drawImage(image)
					},
					fail(err) {
						if(localReg.test(img) || baseReg.test(img)) {
							_drawImage({path: img})
						} else {
							console.error(`getImageInfo:fail ${img} failed ${JSON.stringify(err)}`);
							reject(new Error(`getImageInfo:fail ${img} ${JSON.stringify(err)}`));
						}
					}
				})
			}
			
		})
	}
	
	drawLine(x, y, x2, y2, color, type) {
		const ctx = this.ctx
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x2, y2);
		ctx.closePath();
		ctx.setStrokeStyle(color);
		ctx.stroke();
	}
	
	// eslint-disable-next-line complexity
	drawText(text, box, style) {
		const ctx = this.ctx
		let {
			left: x,
			top: y,
			width: w,
			height: h
		} = box
		let {
			color = '#000000',
			lineHeight = '1.4em',
			fontSize = 14,
			fontWeight,
			fontFamily = 'sans-serif',
			textStyle,
			textAlign = 'left',
			verticalAlign = 'top',
			backgroundColor: bg,
			maxLines,
			textDecoration
		} = style
		if (typeof lineHeight === 'string') { // 1.4em
			lineHeight = Math.ceil(parseFloat(lineHeight.replace('em')) * fontSize)
		}
		//  || (lineHeight > h)
		if (!text) return
		ctx.save()
		ctx.setTextBaseline(verticalAlign)
		// 设置属性
		this.setFont({fontFamily, fontSize, fontWeight, textStyle})
		ctx.setTextAlign(textAlign)
		
		// 背景色
		this.drawBackground(bg, w, h)
		this.roundRect(x, y, w, h, 1, bg)
		// 文字颜色
		ctx.setFillStyle(color)
		// 水平布局
		switch (textAlign) {
			case 'left':
				break
			case 'center':
				x += 0.5 * w
				break
			case 'right':
				x += w
				break
			default:
				break
		}
		const textWidth = this.measureText(text, fontSize)
		const actualHeight = Math.ceil(textWidth / w) * lineHeight
		let paddingTop = Math.ceil((h - actualHeight) / 2)
		if (paddingTop < 0) paddingTop = 0
		// 垂直布局
		switch (verticalAlign) {
			case 'top':
				break
			case 'middle':
				y += fontSize / 2 // paddingTop
				break
			case 'bottom':
				
				y += fontSize // 2 * paddingTop
				break
			default:
				break
		}
		// 绘线
		const _drawLine = (x, y, textWidth) => {
			const { system } = uni.getSystemInfoSync()
			if(/win|mac/.test(system)){
				y += (fontSize / 3)
			}
			
			let to = x
			switch (textAlign) {
				case 'left':
					x = x
					to+= textWidth
					break
				case 'center':
					x = x - textWidth / 2
					to = x + textWidth
					break
				case 'right':
					to = x
					x = x - textWidth
					break
				default:
					break
			}
			
			if(textDecoration) {
				ctx.setLineWidth(fontSize / 13);
				ctx.beginPath();
				
				if (/\bunderline\b/.test(textDecoration)) {
					y -= inlinePaddingTop * 0.8
					ctx.moveTo(x, y);
					ctx.lineTo(to, y);
				}
				
				if (/\boverline\b/.test(textDecoration)) {
					y += inlinePaddingTop
					ctx.moveTo(x, y - lineHeight);
					ctx.lineTo(to, y - lineHeight);
				}
				if (/\bline-through\b/.test(textDecoration)) {
					ctx.moveTo(x , y - lineHeight / 2.5 );
					ctx.lineTo(to, y - lineHeight /2.5 );
				}
				ctx.closePath();
				ctx.setStrokeStyle(color);
				ctx.stroke();
			}
		}
		
		const inlinePaddingTop = Math.ceil((lineHeight - fontSize) / 2)
		// 不超过一行
		if (textWidth <= w && !text.includes('\n')) {
			ctx.fillText(text, x, y + inlinePaddingTop)
			_drawLine(x, y, textWidth)
			return
		}
		// 多行文本
		const chars = text.split('')
		const _y = y
		// 逐行绘制
		let line = ''
		let lineIndex = 0
		let textArray = []
		for(let index = 0 ; index <= chars.length; index++){
			let ch = chars[index] 
		// for (let ch of chars) {
			const isLine = ch === '\n'
			const isRight = index === chars.length - 1
			ch = isLine ? '' : ch
			let testLine = line + ch
			const testWidth = this.measureText(testLine, fontSize) //ctx.measureText(testLine).width
			// 绘制行数大于最大行数，则直接跳出循环
			if (lineIndex >= maxLines) {
				break;
			}
			if (testWidth > w || isLine || isRight) {
				lineIndex++
				line = isRight && testWidth <= w ? testLine : line
				if(lineIndex === maxLines && testWidth > w) {
					while( this.measureText(`${line}...`, fontSize) > w) {
						if (line.length <= 1) {
							// 如果只有一个字符时，直接跳出循环
							break;
						}
						line = line.substring(0, line.length - 1);
					}
					line += '...'
				}
				textArray.push(line)
				ctx.fillText(line, x, y + inlinePaddingTop)
				y += lineHeight
				_drawLine(x, y, testWidth)
				line = ch
				if ((y + lineHeight) > (_y + h)) break
			} else {
				line = testLine
			}
		}
		
		// 避免溢出
		// if ((y + lineHeight) <= (_y + h)) {
		// 	ctx.fillText(line, x, y + inlinePaddingTop)
		// }
		ctx.restore()
	}
	findNode(element, parent = {}, index = 0, siblings = [], source) {
		let computedStyle = Object.assign({}, this.getComputedStyle(element, parent, index));
		let node = {
			id: id++,
			parent,
			computedStyle,
			attributes: Object.assign({}, this.getAttributes(element)),
			name: element?.type || 'view',
		}
		if(JSON.stringify(parent) === '{}') {
			const {left = 0, top = 0, width = 0, height = 0 } = computedStyle
			node.layoutBox = {left, top, width, height }
		} else {
			node.layoutBox = Object.assign({left: 0, top: 0}, this.getLayoutBox(node, parent, index, siblings, source))
		}
		
		if (element?.views) {
			let childrens = []
			node.children = []
			element.views.forEach((v, i) => {
				childrens.push(this.findNode(v, node, i, childrens, element))
			 })
			 node.children = childrens
		}
		return node
	}
	getComputedStyle(element, parent = {}, index = 0) {
		const style = {}
		if(parent.computedStyle) {
			for (let value of Object.keys(parent.computedStyle)){
				const item = parent.computedStyle[value]
				if(['color', 'fontSize', 'lineHeight', 'verticalAlign', 'fontWeight', 'textAlign'].includes(value)) {
					style[value] = /px$/.test(item) ? toPx(item) : item
				}
			}
		}
		const node = JSON.stringify(parent) == '{}' ? element :  element.css ;
		if(!node) return style
		for (let value of Object.keys(node)) {
			const item = node[value]
			if (['boxShadow', 'shadow'].includes(value)) {
				let shadows = item.split(' ').map(v => /^\d/.test(v) ? toPx(v) : v)
				style.boxShadow = shadows
			}
			if (value == 'border') {
				let border = item.split(' ').map(v => /^\d/.test(v) ? toPx(v) : v)
				style.borderWidth = border[0]
				style.borderStyle = border[1]
				style.borderColor = border[2]
			}
			if (['background', 'backgroundColor'].includes(value)) {
				style['backgroundColor'] = item
			}
			// 圆角
			if (value.includes('adius')) {
				if(value == 'radius') {
					let radius = item?.split(' ').map((item) => /^\d/.test(item) && toPx(item, style['width']), []) ||[0];
					if (radius.length == 1) {
						style.borderRadius = radius[0]
					} else {
						let [tl, tr, br, bl] = radius
						style.borderRadius = {
							borderTopLeftRadius: tl,
							borderTopRightRadius: tr || tl,
							borderBottomRightRadius: br || tl,
							borderBottomLeftRadius: tr
						} 
					}
				} else {
					if(typeof style.borderRadius === 'object') {
						style.borderRadius[value] = toPx(item, style['width'])
					}else {
						style.borderRadius = {
							borderTopLeftRadius: style.borderRadius || 0,
							borderTopRightRadius: style.borderRadius || 0,
							borderBottomRightRadius: style.borderRadius || 0,
							borderBottomLeftRadius: style.borderRadius ||0
						} 
						style.borderRadius[value] = toPx(item, style['width'])
					} 
				}
			} else if(value == 'views') {
			} else {
				style[value] = /%|px|rpx$/.test(item) ? toPx(item) : item
			}
		}
		return style
	}
	getLayoutBox(element, parent = {}, index = 0, siblings = [], source = {}) {
		let box = {}
		let {name, computedStyle, layoutBox, attributes} = element || {}
		if(!name) return box
		const isText = name === 'text'
		const isParentText = parent.name ==='text'; 
		const ctx = this.ctx
		// 获取left
		const getNodeLeft = () => {
			if(typeof computedStyle.left === 'number') {
				return computedStyle.left
			}
			// 如果是块元素
			if(!isText) {
				return parent.layoutBox?.left || 0
			}
			// 如果是第1个元素
			const isLeft = index == 0
			if(isLeft) {
				// 如果父级是文本
				if(isParentText) {
					return (parent?.layoutBox?.left || 0) + (parent?.layoutBox?.width || 0)
				} else {
					return (parent?.layoutBox?.left || 0)
				}
			} else {
				const leftNode = siblings[index - 1]
				return leftNode.layoutBox.left + leftNode.layoutBox.width
			}
		}
		
		// 获取宽度
		const getNodeWidth = () => {
			
			if(typeof computedStyle.width === 'number') {
				return computedStyle.width
			}
			if(!isText || isText && computedStyle.textAlign && computedStyle.textAlign !== 'left') {
				return parent?.layoutBox?.width
			}
			if(isText) {
				let {
					fontSize = 14,
					lineHeight = '1.4em',
					fontWeight,
					fontFamily = 'sans-serif',
					textStyle
				} = computedStyle || {}
				this.setFont({fontFamily, fontSize, fontWeight, textStyle})
				let width = this.measureText(attributes.text, fontSize)
				if(!isParentText) {
					if(width < (parent?.layoutBox?.width || 0)) {
						return width
					} else {
						return parent?.layoutBox?.width || 0
					}
				} else {
					const res = this.getParent(parent, 'view')
					const maxWidth = (res.layoutBox.width + res.layoutBox.left) - box.left
					return  maxWidth > width ? width : maxWidth
				}
			}
		}
		// 获取高度
		const getNodeHeight = () => {
			const { verticalAlign, height } = computedStyle
			if(computedStyle.height) {
				return computedStyle.height
			}
			if(!isText) {
				return 0
			}
			
			// 如果父级有高度
			if((parent.layoutBox.height == parent.computedStyle.height && parent.computedStyle.height != 0) && (verticalAlign != 'bottom' && verticalAlign != 'middle')) {
	
				return parent.layoutBox.height
			}
			// 如果父级没有高度
			//  (!parent.computedStyle.height)
			else {
				let {
					fontSize = 14,
					lineHeight = '1.4em',
				} = computedStyle || {}
				if (typeof lineHeight === 'string') { // 1.4em
					lineHeight = Math.ceil(parseFloat(lineHeight.replace('em')) * fontSize)
				}
				let width = this.measureText(attributes.text, fontSize)
				if(parent.layoutBox.width < width) {
					lineHeight = Math.ceil(width / parent.layoutBox.width) * lineHeight
				}
				parent.layoutBox.height = parent.layoutBox.height > lineHeight ? parent.layoutBox.height : lineHeight
				return lineHeight
			} 
			// const res = this.getParent(parent, 'view')
			// const maxHeight = res.layoutBox.height + res.layoutBox.top - box.top
			// return maxHeight
		}
		
		// 获取top
		const getNodeTop = () => {
			const { verticalAlign }  = computedStyle
			if(computedStyle.top) {
				return computedStyle.top
			}
			if(verticalAlign === 'bottom') {
				return parent?.layoutBox?.top + (parent?.layoutBox?.height - box.height || 0)
			} 
			if(verticalAlign === 'middle') {
				return parent?.layoutBox?.top + (parent?.layoutBox?.height - box.height  || 0) / 2
			}
			return parent?.layoutBox?.top || 0  
		}
		box.left = getNodeLeft()
		
		ctx.save()
		box.width = getNodeWidth()
		box.height = getNodeHeight()
		// 获取top
		box.top = getNodeTop()
		
		ctx.restore()
		// for (let value of Object.keys(node)) {
		// 	const item = node[value]
		// 	if(['left', 'right', 'top', 'bottom', 'width', 'height'].includes(value)) {
		// 		box[value] = toPx(item) + (parent?.layoutBox[value] || 0)
		// 	}
		// }
		return box
	}
	
	getParent(element, name) {
		if(element.name === name) {
			return element
		} else if(element.parent){
			return this.getParent(element.parent, name)
		}
	}
	getAttributes(element) {
		let arr = { }
		if(element?.url) {
			arr.src = element.url
		}
		if(element?.text) {
			arr.text = element.text
		}
		return arr
	}
	async drawBoard(element) {
		const node = this.findNode(element)
		return this.drawNode(node)
	}
	async drawNode(element) {
		const {
			layoutBox,
			computedStyle,
			name
		} = element
		const {
			src,
			text
		} = element.attributes
		if (name === 'view') {
			this.drawView(layoutBox, computedStyle)
		} else if (name === 'image') {
			await this.drawImage(src, layoutBox, computedStyle)
		} else if (name === 'text') {
			this.drawText(text, layoutBox, computedStyle)
		}
		if (!element.children) return
		const childs = Object.values ? Object.values(element.children) : Object.keys(element.children).map((key) => element.children[key]);
		for (const child of childs) {
			await this.drawNode(child)
		}
	}
}