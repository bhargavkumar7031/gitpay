import React from 'react'
import PropTypes from 'prop-types'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import ReactPlaceholder from 'react-placeholder'
import { RectShape } from 'react-placeholder/lib/placeholders'
import {
  Avatar,
  Typography,
  Chip,
  Grid,
  withStyles
} from '@material-ui/core'

import { injectIntl, FormattedMessage } from 'react-intl'

import {
  Done as DoneIcon,
} from '@material-ui/icons'

import styled from 'styled-components'
import media from 'app/styleguide/media'

import Constants from '../../consts'
import TaskStatusIcons from './task-status-icons'
import TaskLabels from './task-labels'

const TaskHeaderContainer = styled.div`
  box-sizing: border-box;
  position: relative;

  ${media.phone`
    margin: -1rem -1rem 1rem -1rem;
    padding: 1rem;

    & h1 {
      font-size: 1.75rem;
    }
  `}
`

const Tags = styled.div`
  display: inline-block;

  ${media.phone`
    display: block;
    margin-top: 1rem;
    margin-left: -20px;
  `}
`

const styles = theme => ({
  breadcrumbRoot: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  breadcrumbLink: {
    textDecoration: 'underline'
  },
  breadcrumbText: {
    fontWeight: 700
  },
  chipStatus: {
    marginBottom: theme.spacing(1),
    verticalAlign: 'middle',
    backgroundColor: 'transparent',
    color: theme.palette.primary.success
  },
  avatarStatus: {
    backgroundColor: theme.palette.primary.success,
    width: theme.spacing(0),
    height: theme.spacing(0),
  },
  chipStatusPaid: {
    marginLeft: 0,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.primary.light
  },
  button: {
    width: 100,
    font: 10
  },
  gutterRight: {
    marginRight: 10
  }
})

class TaskHeader extends React.Component {
  goToProjectRepo = (e, url) => {
    e.preventDefault()
    window.open(url, '_blank')
  }

  handleBackToTaskList = (e) => {
    e.preventDefault()
    window.location.assign('/#/tasks/explore')
  }

  render () {
    const { classes, task } = this.props

    const headerPlaceholder = (
      <div className='line-holder'>
        <RectShape
          color='white'
          style={ { marginLeft: 20, marginTop: 20, width: 300, height: 20 } }
        />
      </div>
    )

    return (
      <TaskHeaderContainer>
        <Grid container>
          <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
            { task.data.metadata &&
              <ReactPlaceholder showLoadingAnimation type='text' rows={ 1 }
                ready={ task.completed }>
                <div className={ classes.breadcrumbRoot }>
                  { task.data.project ? (
                    <Breadcrumbs aria-label='breadcrumb' separator={ ' / ' }>
                      <Link href='/' color='inherit' onClick={ this.handleBackToTaskList }>
                        <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                          <FormattedMessage id='task.title.navigation' defaultMessage='Explore issues' />
                        </Typography>
                      </Link>
                      <Link href='/' color='inherit' onClick={ (e) => this.goToProjectRepo(e, task.data.metadata.ownerUrl) }>
                        <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                          { task.data.project.organization.name }
                        </Typography>
                      </Link>
                      <Link href={ `/#/organizations/${task.data.project.OrganizationId}/projects/${task.data.project.id}` } className={ classes.breadcrumb } color='inherit'>
                        <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                          { task.data.project.name }
                        </Typography>
                      </Link>
                      <Typography variant='subtitle2' className={ classes.breadcrumbText }>
                        { task.data.title }
                      </Typography>
                    </Breadcrumbs>
                  ) : (
                    <Breadcrumbs aria-label='breadcrumb' separator={ <NavigateNextIcon fontSize='small' /> }>
                      <Link href='/' color='inherit' onClick={ this.handleBackToTaskList }>
                        <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                          <FormattedMessage id='task.title.navigation' defaultMessage='Explore issues' />
                        </Typography>
                      </Link>
                      <Link href='/' color='inherit' onClick={ (e) => this.goToProjectRepo(e, task.data.metadata.ownerUrl) }>
                        <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                          { task.data.metadata.company }
                        </Typography>
                      </Link>
                      <Link href='/' color='inherit' onClick={ (e) => this.goToProjectRepo(e, task.data.metadata.repoUrl) }>
                        <Typography variant='subtitle2' className={ classes.breadcrumbLink }>
                          { task.data.metadata.projectName }
                        </Typography>
                      </Link>
                      <Typography variant='subtitle2' className={ classes.breadcrumbText }>
                        { task.data.title }
                      </Typography>
                    </Breadcrumbs>
                  ) }
                </div>
              </ReactPlaceholder>
            }
            <ReactPlaceholder ready={ task.completed }>
              <Chip
                label={ this.props.intl.formatMessage(Constants.STATUSES[task.data.status]) }
                avatar={<Avatar className={ classes.avatarStatus } style={{width: 12, height: 12}}> </Avatar>}
                className={ classes.chipStatus }
                onDelete={ this.handleStatusDialog }
                onClick={ this.handleStatusDialog }
                deleteIcon={ <DoneIcon /> }
              />
            </ReactPlaceholder>
            <ReactPlaceholder customPlaceholder={ headerPlaceholder } showLoadingAnimation
              ready={ task.completed }>
              <Typography variant='h4' align='left' gutterBottom>
                { task.data.title }
                <TaskStatusIcons status={ task.data.private ? 'private' : 'public' } bounty />
              </Typography>
            </ReactPlaceholder>
            <ReactPlaceholder ready={ task.completed }>
              { task.data.metadata &&
                <TaskLabels labels={ task.data.metadata.labels } />
              }
            </ReactPlaceholder>
          </Grid>
        </Grid>

      </TaskHeaderContainer>
    )
  }
}

TaskHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  task: PropTypes.object
}

export default injectIntl(withStyles(styles)(TaskHeader))
