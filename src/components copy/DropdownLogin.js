import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { updateZIndex } from '../actions/updateStates-action'
import { logOut, ClearNav } from '../actions/putLogin-actions.js/logOut'

// TODO: This is missing functionality for sub-menu here from SUI core examples.
// The "Publish To Web" item should contain a sub-menu.



const dropdownText = (user) => (
    <p className='custom_margin_null main_header_items flex-direction-column'>
        <span>{user}</span>
        <br />
        <span>99.9 <sup>₼</sup></span>
    </p>
)

const DropdownLogin = (props) => {

    const onOpen = () => {
        props.updateZIndex(true)
    }

    const onClose = () => {
        props.updateZIndex(false)
    }



    const logOut = () => {
        props.logOut()
        props.ClearNav()
    }
    return (
        <Dropdown onOpen={onOpen} onClose={onClose} className='flex-direction-column-center' text={dropdownText(props.user)}>
            <Dropdown.Menu>
                <Dropdown.Item text='Profil'
                    as={Link}
                    to={'/profile'} />
                <Dropdown.Item text='Yoxlama' />
                <Dropdown.Item
                    text='Ayarlar'
                    as={Link}
                    to={'/settings'} />
                <Dropdown.Item
                    text='Balans artır'

                />
                <Dropdown.Divider />
                <Dropdown.Item onClick={logOut} text='Çıxış' />
            </Dropdown.Menu>
        </Dropdown >
    )


}

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {
    updateZIndex, logOut, ClearNav
}

export default connect(mapStateToProps, mapDispatchToProps)(DropdownLogin)
